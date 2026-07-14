# Generate data/qbank.js from the Bihar Economics Question Bank docx
import docx, re, json, unicodedata

SRC = r'C:\Users\ASUS\Downloads\Comprehensive Bihar Economics Question Bank_ Classes X, XI, and XII (1).docx'
OUT = r'C:\Users\ASUS\Desktop\econ-master\data\qbank.js'

GROUPS = {
    'Part I: Class X - Understanding Economic Development':
        dict(id='x', grade='10', title='Class X · Understanding Economic Development', sub='CBSE / Bihar Board · Economics'),
    'Part II: Class XI - Indian Economic Development':
        dict(id='xi', grade='11', title='Class XI · Indian Economic Development', sub='CBSE / Bihar Board · Economics'),
    'Part III: Class XII - Introductory Macroeconomics':
        dict(id='xii-macro', grade='12', title='Class XII · Introductory Macroeconomics', sub='CBSE / Bihar Board · Economics'),
    'Part IV: Class XII - Introductory Microeconomics':
        dict(id='xii-micro', grade='12', title='Class XII · Introductory Microeconomics', sub='CBSE / Bihar Board · Economics'),
}

def clean(s):
    # normalise smart punctuation to plain ASCII
    s = s.replace('’', "'").replace('‘', "'")
    s = s.replace('“', '"').replace('”', '"')
    s = s.replace('–', '-').replace('—', '-')
    return s.strip()

d = docx.Document(SRC)
groups = []          # ordered list of group dicts
gmap = {}            # part-name -> group dict
cur_chapter = None
qpat = re.compile(r'^Q:\s*(.*?)\s*A:\s*(.*)$')

for p in d.paragraphs:
    st = p.style.name if p.style else ''
    t = p.text.strip()
    if not t:
        continue
    if st == 'Heading 4':
        meta = GROUPS.get(t)
        if not meta:
            raise SystemExit('Unknown part heading: ' + repr(t))
        g = dict(id=meta['id'], grade=meta['grade'], title=meta['title'], sub=meta['sub'], chapters=[])
        groups.append(g); gmap[t] = g; cur_group = g; cur_chapter = None
    elif st == 'Heading 5':
        m = re.match(r'Source\s+(\d+)\s*:\s*(.*)$', t)
        if not m:
            raise SystemExit('Unexpected source heading: ' + repr(t))
        num = int(m.group(1)); title = clean(m.group(2))
        cur_chapter = dict(id='q%d' % num, num=num, title=title, questions=[])
        cur_group['chapters'].append(cur_chapter)
    elif st == 'normal' and t.startswith('Q'):
        m = qpat.match(t)
        if not m:
            continue
        q = clean(m.group(1)); a = clean(m.group(2))
        if q and a and cur_chapter is not None:
            cur_chapter['questions'].append({'q': q, 'a': a})

total = sum(len(c['questions']) for g in groups for c in g['chapters'])
QBANK = {'updated': '2026-07-14', 'total': total, 'groups': groups}

body = json.dumps(QBANK, ensure_ascii=True, indent=0, separators=(',', ':'))
# compact the array-of-objects a little: keep as-is (indent=0 already minimal newlines)

header = (
    "// Bihar Economics Question Bank - %d authentic short-answer Q&A\n"
    "// Auto-generated from the uploaded question bank docx. Chapter-wise, Classes X/XI/XII.\n"
    "// Do NOT hand-edit; regenerate with tools/gen-qbank (see scratchpad generator).\n\n"
) % total

js = header + "export const QBANK = " + body + ";\n\n"
js += "export const QBANK_TOTAL = QBANK.total;\n\n"
js += (
    "const _idx = {};\n"
    "for (const g of QBANK.groups) for (const c of g.chapters) {\n"
    "  c.count = c.questions.length;\n"
    "  _idx[g.id + '/' + c.id] = { group: g, chapter: c };\n"
    "}\n\n"
    "export function qbFind(groupId, chapterId) {\n"
    "  return _idx[groupId + '/' + chapterId] || null;\n"
    "}\n\n"
    "export function qbGroup(groupId) {\n"
    "  return QBANK.groups.find(g => g.id === groupId) || null;\n"
    "}\n"
)

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(js)

print('Wrote', OUT)
print('Total questions:', total)
print('Groups:', [(g['id'], len(g['chapters']), sum(len(c['questions']) for c in g['chapters'])) for g in groups])
import os
print('File size KB:', round(os.path.getsize(OUT)/1024, 1))
