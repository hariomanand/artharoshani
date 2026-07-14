// MCQ option builder for the question bank — retrieval-based distractor
// generation (COLING 2020-style): wrong options are pooled from OTHER
// authentic answers in the same chapter / class group / bank, ranked by
// type match (numeric↔numeric, full-form↔full-form, similar length).
// Nothing is invented — every option shown is a real answer string from
// the bank; exactly one belongs to the asked question.
import { QBANK } from '../data/qbank.js';

const norm = s => String(s).toLowerCase().replace(/[\s.?!;:,]+$/, '').trim();
export const isYesNo = a => /^(yes|no)[.!]?$/i.test(String(a).trim());
const hasNum = s => /\d/.test(s);
const bucket = a => { const w = a.split(/\s+/).length; return w <= 1 ? 0 : w <= 3 ? 1 : 2; };
const BUCKET_ORDER = { 0: [0, 1, 2], 1: [1, 0, 2], 2: [2, 1, 0] };
const isFullFormQ = q => /full form|stands for|abbreviat/i.test(q);

function mkPool() { return { num: [], text: [[], [], []], seen: new Set() }; }
function addTo(p, a) {
  const n = norm(a);
  if (p.seen.has(n)) return;
  p.seen.add(n);
  if (hasNum(a)) p.num.push(a); else p.text[bucket(a)].push(a);
}

let POOLS = null;
function buildPools() {
  POOLS = { global: mkPool(), groups: {}, chapters: {}, fullform: [], ffSeen: new Set() };
  for (const g of QBANK.groups) {
    const gp = POOLS.groups[g.id] = mkPool();
    for (const c of g.chapters) {
      const cp = POOLS.chapters[g.id + '/' + c.id] = mkPool();
      for (const { q, a } of c.questions) {
        if (isYesNo(a)) continue;
        addTo(cp, a); addTo(gp, a); addTo(POOLS.global, a);
        if (isFullFormQ(q) && !POOLS.ffSeen.has(norm(a))) { POOLS.ffSeen.add(norm(a)); POOLS.fullform.push(a); }
      }
    }
  }
}

const shuffled = arr => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
function take(cands, exclude, want, out) {
  for (const c of cands) {
    if (out.length >= want) return;
    const n = norm(c);
    if (exclude.has(n)) continue;
    exclude.add(n);
    out.push(c);
  }
}

/* Build { list, answer } for one question. Yes/No answers become a clean
   two-option question; everything else gets 3 type-matched distractors. */
export function buildOptions(groupId, chapterId, qText, aText) {
  if (isYesNo(aText)) {
    return { list: ['Yes', 'No'], answer: /^y/i.test(aText.trim()) ? 0 : 1 };
  }
  if (!POOLS) buildPools();
  const cp = POOLS.chapters[groupId + '/' + chapterId] || mkPool();
  const gp = POOLS.groups[groupId] || mkPool();
  const exclude = new Set([norm(aText)]);
  const d = [];
  if (isFullFormQ(qText)) take(shuffled(POOLS.fullform), exclude, 3, d);
  if (hasNum(aText)) {
    take(shuffled(cp.num), exclude, 3, d);
    take(shuffled(gp.num), exclude, 3, d);
    take(shuffled(POOLS.global.num), exclude, 3, d);
  }
  const order = BUCKET_ORDER[bucket(aText)];
  for (const p of [cp, gp, POOLS.global])
    for (const b of order) take(shuffled(p.text[b]), exclude, 3, d);
  const list = shuffled([aText, ...d.slice(0, 3)]);
  return { list, answer: list.indexOf(aText) };
}
