# Builds the ArthaRoshni Economics Labs PDF catalogue from data/catalogue.json.
# Output: docs/ArthaRoshni-500-Labs-Catalogue.pdf (also copied to web root for download).
import json, os, datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                PageBreak, LongTable, HRFlowable)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = json.load(open(os.path.join(ROOT, 'data', 'catalogue.json'), encoding='utf-8'))

# ---- palette ----
INK   = colors.HexColor('#0f172a')
BLUE  = colors.HexColor('#1d4ed8')
TEAL  = colors.HexColor('#0d9488')
PURP  = colors.HexColor('#7c3aed')
GREY  = colors.HexColor('#475569')
LIGHT = colors.HexColor('#eef2ff')
LINE  = colors.HexColor('#d7dcec')

styles = getSampleStyleSheet()
def S(name, **kw):
    styles.add(ParagraphStyle(name, parent=styles['Normal'], **kw))
S('H1', fontName='Helvetica-Bold', fontSize=20, textColor=BLUE, spaceAfter=6, spaceBefore=8, leading=24)
S('H2', fontName='Helvetica-Bold', fontSize=14, textColor=INK, spaceAfter=4, spaceBefore=14, leading=18)
S('Body', fontName='Helvetica', fontSize=10, textColor=INK, leading=15, spaceAfter=6)
S('Small', fontName='Helvetica', fontSize=8.5, textColor=GREY, leading=12)
S('Cell', fontName='Helvetica', fontSize=7.2, textColor=INK, leading=8.6)
S('CellB', fontName='Helvetica-Bold', fontSize=7.2, textColor=colors.white, leading=8.6)
S('KTitle', fontName='Helvetica-Bold', fontSize=28, textColor=colors.white, leading=32, alignment=TA_CENTER)
S('KSub', fontName='Helvetica', fontSize=12, textColor=colors.HexColor('#dbe4ff'), leading=18, alignment=TA_CENTER)
S('Src', fontName='Helvetica-Oblique', fontSize=8, textColor=GREY, leading=11)

story = []
def para(t, s='Body'): story.append(Paragraph(t, styles[s]))
def sp(h=8): story.append(Spacer(1, h))
def rule(): story.append(HRFlowable(width='100%', thickness=0.7, color=LINE, spaceBefore=6, spaceAfter=6))

# ============================ COVER ============================
cover = Table([[Paragraph('₹', ParagraphStyle('logo', fontName='Helvetica-Bold', fontSize=52, textColor=colors.white, alignment=TA_CENTER))],
               [Paragraph('ArthaRoshni', styles['KTitle'])],
               [Paragraph('The 500-Lab Economics Skills Catalogue', styles['KSub'])],
               [Spacer(1, 8)],
               [Paragraph('Free technical labs, notes & research skills for<br/>Class 10 · 11 · 12 and early college — built for every student', styles['KSub'])],
               [Spacer(1, 6)],
               [Paragraph('by <b>Roshani</b>', styles['KSub'])]],
              colWidths=[170*mm])
cover.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), BLUE),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('TOPPADDING', (0,0), (-1,-1), 10),
    ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ('LEFTPADDING', (0,0), (-1,-1), 18),
    ('RIGHTPADDING', (0,0), (-1,-1), 18),
    ('ROUNDEDCORNERS', [12,12,12,12]),
]))
story.append(Spacer(1, 55*mm))
story.append(cover)
sp(20)
para('A practical curriculum you can build online for free — using Google Colab, open data '
     '(World Bank, RBI, MoSPI), and open-source tools. Inspired by the technical facilities of the '
     'world’s leading economics departments, redesigned so any student can access them at zero cost.',
     'KSub' if False else 'Body')
para(f'Generated {datetime.date.today().strftime("%d %B %Y")} · {len(DATA)} labs · 10 skill tracks', 'Small')
story.append(PageBreak())

# ============================ VISION ============================
para('1 · Vision & Who This Is For', 'H1')
rule()
para('ArthaRoshni is a free, offline-first learning platform for economics students in Classes 10–12 and '
     'early college — with a special focus on students in India (and Bihar) who rarely get exposure to the '
     'global-level "technical labs" that top universities run. Those labs (econometrics computing, '
     'experimental economics, data-science) usually need expensive software and infrastructure. This '
     'catalogue re-creates their <b>spirit</b> using free, open tools so cost is never a barrier.')
para('<b>What a student gets:</b> clear notes, PPT/reading material, quizzes, and 500 structured hands-on '
     'labs that teach real research skills — Python, statistics, econometrics, NLP/sentiment analysis, '
     'behavioural experiments, climate and development economics, and a capstone research track.')
para('<b>Honest scope note.</b> The 500 labs below are ArthaRoshni’s own curriculum — activities you can build '
     'and run for free. Section 2 separately summarises what real top universities offer (with sources); it '
     'does not claim these 500 are named foreign-university labs.', 'Small')

# ============================ GLOBAL UNIVERSITIES ============================
para('2 · What the World’s Top Universities Offer', 'H2')
para('Leading universities increasingly blend economics with computing, data science and AI. A few real, '
     'verifiable examples of the programs, tools and skills they teach — which this catalogue mirrors with free tools:')

uni_rows = [
    ['Institution / Program', 'Focus & tools', 'Skills taught'],
    ['MIT — BSc Computer Science, Economics & Data Science (Course 6-14)',
     'Microeconomic theory, econometrics, algorithms, optimization, machine learning',
     'Game theory, modelling, data analytics'],
    ['ETH Zurich — CAS in AI, Data & Machine Learning',
     'Python, SQL, data science & ML end-to-end, AI in industry',
     'Programming, data, ML pipelines'],
    ['UC Berkeley — Econometrics Laboratory (EML)',
     'Stata, R, EViews, RATS, MATLAB on a shared computing facility',
     'Applied econometrics & research computing'],
    ['UC Santa Barbara — Experimental & Behavioral Economics Lab (EBEL); UC Berkeley XLab',
     'oTree, z-Tree experiment software',
     'Designing & running economic experiments'],
    ['University of Zurich — MSc Informatics: Artificial Intelligence',
     '90 ECTS with minors incl. economics & computational linguistics',
     'AI, data science, NLP'],
    ['Text-as-data in economics research',
     'Loughran–McDonald finance dictionary; Economic Policy Uncertainty index; VADER/NLTK',
     'Sentiment & tone of policy/news text'],
    ['Indian institutes (IITs / IIMs / ISI / Delhi School of Economics)',
     'Econometrics, data science, financial economics with Python/R/Stata',
     'Quantitative & applied economics'],
]
t = Table([[Paragraph(c, styles['Cell'] if r else styles['CellB']) for c in row] for r, row in enumerate(uni_rows)],
          colWidths=[62*mm, 60*mm, 48*mm])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), INK),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT]),
    ('GRID', (0,0), (-1,-1), 0.4, LINE),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 5),
    ('RIGHTPADDING', (0,0), (-1,-1), 5),
]))
sp(4); story.append(t); sp(6)
para('Sources: MIT Course Catalog (6-14); ETH Zurich School for Continuing Education (CAS AI, Data & ML); '
     'UC Berkeley Econometrics Laboratory (eml.berkeley.edu); UC Santa Barbara EBEL; University of Zurich MSc AI; '
     'Loughran–McDonald master dictionary (sraf.nd.edu); policyuncertainty.com.', 'Src')

# ============================ AI & EMERGING ============================
para('3 · AI, Robotics & Emerging Techniques in Economics', 'H2')
para('Modern economics is being reshaped by computation. The labs in this catalogue introduce students to:')
for b in [
    '<b>Python & R</b> for data handling, econometrics and reproducible research (free via Google Colab / RStudio).',
    '<b>Machine learning</b> for prediction and causal inference (Lasso, random forests, double ML).',
    '<b>NLP & sentiment analysis</b> — measuring the tone of RBI statements, budgets and news ("text-as-data").',
    '<b>Behavioural & experimental economics</b> — online games (oTree) to study real decision-making.',
    '<b>Climate & environmental economics</b> — emissions data, carbon pricing, cost–benefit analysis.',
    '<b>Computational & agent-based modelling</b> — simulating markets and policy.',
    '<b>AI/robotics link</b> — automation’s effect on labour markets, algorithmic pricing, and AI for economic forecasting.',
]:
    para('• ' + b, 'Body')

# ============================ BUILD IT FREE ============================
para('4 · How to Build These Labs Online — For Free', 'H2')
para('<b>The whole stack costs ₹0.</b> Requirements and steps:')
build_rows = [
    ['Layer', 'Free tool', 'Purpose'],
    ['Compute / notebooks', 'Google Colab', 'Run Python labs in the browser, no install'],
    ['Language & libraries', 'Python, pandas, NumPy, matplotlib, statsmodels, scikit-learn, NLTK', 'Data, stats, econometrics, NLP'],
    ['Statistics (alt.)', 'R + RStudio, Gretl', 'Free econometrics packages'],
    ['Experiments', 'oTree, Google Forms', 'Behavioural games & surveys'],
    ['Open data', 'World Bank, RBI, MoSPI, IPCC, Our World in Data, UN Comtrade', 'Real datasets for every lab'],
    ['Website & hosting', 'Cloudflare Pages + GitHub', 'Publish the app free with a free domain'],
    ['Database / admin', 'Supabase (free tier)', 'Store notes, PPTs, users (optional)'],
]
t2 = Table([[Paragraph(c, styles['Cell'] if r else styles['CellB']) for c in row] for r, row in enumerate(build_rows)],
           colWidths=[35*mm, 70*mm, 65*mm])
t2.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), TEAL),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#eafaf7')]),
    ('GRID', (0,0), (-1,-1), 0.4, LINE),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 4), ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 5), ('RIGHTPADDING', (0,0), (-1,-1), 5),
]))
sp(4); story.append(t2); sp(6)
para('<b>Steps to launch one lab:</b> (1) write it as a Colab notebook with objective + data link + code + a quiz; '
     '(2) add a page on the website that embeds/links the notebook; (3) attach the dataset and a short assessment; '
     '(4) publish. Repeat per lab — the table below gives you all 500 to build.')
story.append(PageBreak())

# ============================ THE 500-LAB TABLE ============================
para('5 · The 500-Lab Master Catalogue', 'H1')
rule()
para('10 tracks × 50 labs. Columns: ID · Title · Level · Key skills · Tools · Output. '
     'Build each as a free notebook or web activity.', 'Small')
sp(4)

# group by track preserving order
tracks = []
seen = {}
for lab in DATA:
    if lab['track'] not in seen:
        seen[lab['track']] = []
        tracks.append(lab['track'])
    seen[lab['track']].append(lab)

TRACK_COLORS = {}
palette = [TEAL, BLUE, PURP, colors.HexColor('#1d4ed8'), colors.HexColor('#4338ca'),
           colors.HexColor('#b45309'), colors.HexColor('#dc2626'), colors.HexColor('#059669'),
           colors.HexColor('#0891b2'), colors.HexColor('#9333ea')]
for i, tr in enumerate(tracks):
    TRACK_COLORS[tr] = palette[i % len(palette)]

for ti, tr in enumerate(tracks):
    labs = seen[tr]
    tc = TRACK_COLORS[tr]
    para(f'{labs[0]["icon"]} Track {ti+1}: {tr}', 'H2')
    para(f'{len(labs)} labs · {labs[0]["data"]} · {labs[0]["tools"]}', 'Small')
    header = ['ID', 'Lab title', 'Level', 'Key skills', 'Output']
    rows = [[Paragraph(h, styles['CellB']) for h in header]]
    for l in labs:
        rows.append([
            Paragraph(l['id'], styles['Cell']),
            Paragraph(l['title'], styles['Cell']),
            Paragraph(l['level'], styles['Cell']),
            Paragraph(l['skills'], styles['Cell']),
            Paragraph(l['output'], styles['Cell']),
        ])
    tbl = LongTable(rows, colWidths=[10*mm, 52*mm, 16*mm, 48*mm, 44*mm], repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), tc),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT]),
        ('GRID', (0,0), (-1,-1), 0.3, LINE),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 2.5), ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 4), ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(tbl)
    story.append(PageBreak())

# ============================ CLOSING ============================
para('6 · Deploy & Scale', 'H1')
rule()
para('This catalogue is the content backbone of the ArthaRoshni web app. To publish it for free: push the '
     'project to GitHub, connect Cloudflare Pages (free hosting + a free <i>*.pages.dev</i> domain), and '
     'optionally connect Supabase for the admin panel. Full instructions are in <b>DEPLOYMENT.md</b>.')
para('To expand beyond 500, break any lab into micro-labs (e.g. "simple regression" → load data, visualise, '
     'correlate, fit OLS, read residuals, interpret, write up). Regenerate this document any time with '
     '<b>python tools/build-pdf.py</b>.')
para('© ArthaRoshni — free to use and share for education. Built for students who deserve world-class '
     'economics training at zero cost.', 'Small')

# ============================ page numbers ============================
def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(GREY)
    canvas.drawString(18*mm, 12*mm, 'ArthaRoshni · 500-Lab Economics Catalogue')
    canvas.drawRightString(192*mm, 12*mm, f'Page {doc.page}')
    canvas.restoreState()

os.makedirs(os.path.join(ROOT, 'docs'), exist_ok=True)
out = os.path.join(ROOT, 'docs', 'ArthaRoshni-500-Labs-Catalogue.pdf')
doc = SimpleDocTemplate(out, pagesize=A4, topMargin=16*mm, bottomMargin=18*mm,
                        leftMargin=18*mm, rightMargin=18*mm,
                        title='ArthaRoshni — 500 Economics Labs Catalogue', author='ArthaRoshni')
doc.build(story, onFirstPage=footer, onLaterPages=footer)

# copy to web root for download link
import shutil
shutil.copy(out, os.path.join(ROOT, 'ArthaRoshni-500-Labs-Catalogue.pdf'))
print('PDF written:', out, '(', os.path.getsize(out)//1024, 'KB )')
