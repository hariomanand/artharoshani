import { CLASSES, byClass, findChapter, allReadyChapters, stats } from '../data/index.js';
import { renderBlocks } from './blocks.js';
import { Store } from './store.js';
import { renderLabsHub, renderLab, wireLabs, renderCatalogue, renderCatalogueLab } from './labs.js';
import { labById } from '../data/labs.js';
import { CATALOGUE } from '../data/catalogue.js';
import { syncFromCloud, extraMedia } from './content.js';

const app = document.getElementById('app');
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const gradeColor = g => ({ '10': 'var(--c10)', '11': 'var(--c11)', '12': 'var(--c12)' }[g] || 'var(--primary)');

/* -------------------------------------------------- routing */
function parseHash() {
  const h = location.hash.replace(/^#\/?/, '');
  const parts = h.split('/').filter(Boolean);
  return { name: parts[0] || 'home', params: parts.slice(1) };
}

const routes = {
  home: viewHome,
  class: viewClass,
  read: viewRead,
  quiz: viewQuiz,
  practice: viewPractice,
  bookmarks: viewBookmarks,
  search: viewSearch,
  about: viewAbout,
  labs: viewLabs,
  lab: viewLab,
  catalogue: viewCatalogue,
  'lab-item': viewCatalogueLab,
};

function viewLabs() { return topbar('Technical Labs', 'Hands-on economics') + renderLabsHub(); }
function viewLab([id]) {
  const l = labById(id);
  return topbar(l ? l.title : 'Lab', 'Technical Lab', { back: '#/labs' }) + renderLab(id);
}
function viewCatalogue() { return topbar('500 Labs', 'Master catalogue', { back: '#/labs' }) + renderCatalogue(); }
function viewCatalogueLab([id]) {
  const l = CATALOGUE.find(x => x.id === id);
  return topbar(l ? `Lab ${l.id}` : 'Lab', l ? l.track : '', { back: '#/catalogue' }) + renderCatalogueLab(id);
}

function render() {
  const { name, params } = parseHash();
  const view = routes[name] || viewHome;
  const activeTab = ['lab', 'catalogue', 'lab-item'].includes(name) ? 'labs' : name;
  app.innerHTML = `<div class="app">${view(params)}</div>${tabbar(activeTab)}`;
  window.scrollTo(0, 0);
  wire();
  wireLabs();
}
window.addEventListener('hashchange', render);

/* -------------------------------------------------- shared UI */
function topbar(title, sub, opts = {}) {
  const back = opts.back ? `<a class="topbar__back" href="${opts.back}">‹</a>` : '';
  const bm = opts.bookmarkId != null
    ? `<button class="topbar__action js-bookmark ${Store.isBookmarked(opts.bookmarkId) ? 'is-active' : ''}" data-id="${opts.bookmarkId}" aria-label="Bookmark">${Store.isBookmarked(opts.bookmarkId) ? '★' : '☆'}</button>`
    : '';
  return `<header class="topbar">
    ${back}
    <div class="topbar__title">${esc(title)}${sub ? `<small>${esc(sub)}</small>` : ''}</div>
    <div class="topbar__spacer"></div>
    ${bm}
  </header>`;
}

function tabbar(active) {
  const items = [
    { n: 'home', href: '#/', ic: '🏠', l: 'Home' },
    { n: 'labs', href: '#/labs', ic: '🔬', l: 'Labs' },
    { n: 'practice', href: '#/practice', ic: '📝', l: 'Practice' },
    { n: 'bookmarks', href: '#/bookmarks', ic: '★', l: 'Saved' },
    { n: 'about', href: '#/about', ic: 'ℹ️', l: 'About' },
  ];
  return `<nav class="tabbar">${items.map(i =>
    `<a href="${i.href}" class="${active === i.n ? 'active' : ''}"><span class="ic">${i.ic}</span>${i.l}</a>`
  ).join('')}</nav>`;
}

/* -------------------------------------------------- HOME */
function viewHome() {
  const s = stats();
  const prog = Store.progress();
  const pct = Math.round((prog.readCount / Math.max(s.ready, 1)) * 100);

  const classCards = CLASSES.map(c => {
    const chs = c.subjects.flatMap(su => su.chapters);
    const readyCount = chs.filter(x => x.status === 'ready').length;
    const readCount = chs.filter(x => Store.isRead(x.id)).length;
    const p = Math.round((readCount / Math.max(readyCount, 1)) * 100);
    return `<a class="class-card" href="#/class/${c.id}">
      <div class="class-card__badge" style="background:linear-gradient(135deg, ${c.color}, ${c.color}bb)">
        <b>${c.grade}</b>Class
      </div>
      <div class="class-card__body">
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.subtitle)}</p>
        <div class="class-card__meta"><span>📚 ${chs.length} chapters</span><span>✅ ${readyCount} ready</span></div>
        <div class="pbar"><i style="width:${p}%"></i></div>
      </div>
      <div class="class-card__chev">›</div>
    </a>`;
  }).join('');

  return topbar('ArthaPath') + `<main class="page">
    <div class="hero">
      <div class="hero__glow">₹</div>
      <div class="hero__badge">🎓 CBSE · NCERT-aligned</div>
      <h1>Master Economics,<br>Class 10 to 12</h1>
      <p>Clear chapter-wise notes, infographics, connector diagrams and a practice question bank — fully offline, always free.</p>
      <div class="hero__stats">
        <div class="hero__stat"><b>${s.chapters}</b><span>Chapters</span></div>
        <div class="hero__stat"><b>${s.questions}+</b><span>Questions</span></div>
        <div class="hero__stat"><b>${pct}%</b><span>You’ve read</span></div>
      </div>
    </div>

    <div class="section-title">📖 Choose your class</div>
    <div class="class-grid">${classCards}</div>

    <div class="section-title">🔬 Technical labs</div>
    <a class="class-card" href="#/labs">
      <div class="class-card__badge" style="background:linear-gradient(135deg,#7c3aed,#0d9488)">🔬</div>
      <div class="class-card__body">
        <h3>Economics Labs</h3>
        <p>Run regressions, simulate markets, analyze sentiment & more</p>
        <div class="class-card__meta"><span>▶ 6 interactive tools</span><span>🏛️ University-style</span></div>
      </div>
      <div class="class-card__chev">›</div>
    </a>

    <div class="section-title">⚡ Quick start</div>
    <div class="btn-row">
      <a class="btn" href="#/practice">📝 Practice questions</a>
      <a class="btn btn--ghost" href="#/search">🔎 Search topics</a>
    </div>
  </main>`;
}

/* -------------------------------------------------- CLASS */
function viewClass([classId]) {
  const cls = byClass[classId];
  if (!cls) return notFound();

  const subjects = cls.subjects.map(sub => {
    const rows = sub.chapters.map(ch => {
      const done = Store.isRead(ch.id);
      const ready = ch.status === 'ready';
      const href = ready ? `#/read/${cls.id}/${ch.id}` : '#/about';
      return `<a class="chapter-row ${done ? 'done' : ''}" href="${href}">
        <div class="chapter-row__num">${done ? '✓' : ch.number}</div>
        <div class="chapter-row__body">
          <h4>${esc(ch.title)}</h4>
          <p>${esc(ch.summary || '')}</p>
          <p>${ready
              ? `<span class="tag tag--ready">Ready</span> <span>${(ch.questions || []).length} Q</span> <span>${esc(ch.readingTime || '')}</span>`
              : `<span class="tag tag--soon">Notes coming</span>`}</p>
        </div>
        <div class="chapter-row__chev">›</div>
      </a>`;
    }).join('');
    return `<div class="subject-block">
      <div class="subject-head">
        <span class="dot" style="background:${sub.color || cls.color}"></span>
        <div><h2>${esc(sub.title)}</h2><small>${esc(sub.note || '')}</small></div>
      </div>
      ${rows}
    </div>`;
  }).join('');

  return topbar(cls.title, cls.subtitle, { back: '#/' }) + `<main class="page">
    ${subjects}
    <a class="btn btn--ghost mt" href="${cls.ncert}" target="_blank" rel="noopener">🔗 Open NCERT textbook reference</a>
  </main>`;
}

/* -------------------------------------------------- READ (chapter) */
function viewRead([classId, chapterId]) {
  const found = findChapter(classId, chapterId);
  if (!found || found.ch.status !== 'ready') return notFound();
  const { cls, sub, ch } = found;
  Store.markRead(ch.id);

  const lessonNav = ch.lessons.length > 1
    ? `<nav class="lesson-nav">${ch.lessons.map((l, i) =>
        `<a href="#lesson-${i}" data-lesson="${i}">${i + 1}. ${esc(l.title.split('—')[0].trim())}</a>`).join('')}</nav>`
    : '';

  const lessons = ch.lessons.map((l, i) => `
    <section class="lesson" id="lesson-${i}">
      <h2 class="lesson__title"><span class="idx">${i + 1}</span> ${esc(l.title)}</h2>
      ${renderBlocks(l.blocks)}
    </section>`).join('');

  const terms = (ch.keyTerms || []).length ? `
    <div class="section-title">🔑 Key terms</div>
    <div class="terms">${ch.keyTerms.map(t => `<div class="term"><b>${esc(t.term)}</b><span>${esc(t.def)}</span></div>`).join('')}</div>` : '';

  return topbar(`Ch ${ch.number}`, cls.title, { back: `#/class/${cls.id}`, bookmarkId: ch.id }) + `<main class="page">
    <div class="reader-head">
      <div class="kicker">${esc(sub.title)}</div>
      <h1>${esc(ch.title)}</h1>
      <p class="lead">${esc(ch.lead || ch.summary)}</p>
      <div class="reader-meta">
        <span class="chip">⏱ ${esc(ch.readingTime || '')}</span>
        <span class="chip">📄 ${ch.lessons.length} lessons</span>
        <span class="chip">❓ ${(ch.questions || []).length} questions</span>
      </div>
    </div>
    ${lessonNav}
    ${lessons}
    ${terms}
    ${renderMedia(ch.id)}
    <div class="divider"></div>
    <a class="btn" href="#/quiz/${cls.id}/${ch.id}">📝 Take the chapter quiz →</a>
  </main>`;
}

/* -------------------------------------------------- QUIZ */
const quizState = {};
function viewQuiz([classId, chapterId]) {
  const found = findChapter(classId, chapterId);
  if (!found) return notFound();
  const { cls, ch } = found;
  const qs = (ch.questions || []).filter(q => q.type !== 'subjective');
  if (!qs.length) return topbar('Quiz', cls.title, { back: `#/read/${cls.id}/${ch.id}` }) +
    `<main class="page">${empty('🧩', 'No objective questions yet', 'Practice questions for this chapter are coming.')}</main>`;

  quizState[ch.id] = quizState[ch.id] || { i: 0, correct: 0, answered: false, done: false };
  const st = quizState[ch.id];

  let body;
  if (st.done) {
    const pctVal = Math.round((st.correct / qs.length) * 100);
    Store.saveScore(ch.id, st.correct, qs.length);
    const r = 54, circ = 2 * Math.PI * r, off = circ * (1 - pctVal / 100);
    body = `<div class="scorecard">
      <svg class="ring" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r="${r}" fill="none" stroke="var(--line)" stroke-width="12"/>
        <circle cx="65" cy="65" r="${r}" fill="none" stroke="${pctVal >= 60 ? 'var(--ok)' : 'var(--danger)'}" stroke-width="12"
          stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${off}" transform="rotate(-90 65 65)"/>
        <text x="65" y="72" text-anchor="middle" font-size="28" font-weight="800" fill="var(--ink)">${pctVal}%</text>
      </svg>
      <h2>${st.correct} / ${qs.length} correct</h2>
      <p class="muted">${pctVal >= 80 ? 'Excellent! 🎉' : pctVal >= 60 ? 'Good going — revise the misses.' : 'Keep practising — reread the chapter.'}</p>
      <div class="btn-row">
        <button class="btn js-retry" data-ch="${ch.id}">🔁 Retry</button>
        <a class="btn btn--ghost" href="#/read/${cls.id}/${ch.id}">📖 Reread</a>
      </div>
    </div>`;
  } else {
    const q = qs[st.i];
    const opts = q.options.map((o, idx) => {
      let cls2 = '';
      if (st.answered) { if (idx === q.answer) cls2 = 'correct'; else if (idx === st.picked) cls2 = 'wrong'; }
      return `<button class="quiz-opt ${cls2}" data-idx="${idx}" ${st.answered ? 'disabled' : ''}>
        <span class="key">${String.fromCharCode(65 + idx)}</span><span>${esc(o)}</span></button>`;
    }).join('');
    const pyq = q.source === 'pyq' ? `<span class="pyq-badge">PYQ ${q.year || ''}</span>` : '';
    body = `
      <div class="quiz-progress">
        <div class="pbar"><i style="width:${(st.i / qs.length) * 100}%"></i></div>
        <span class="quiz-count">${st.i + 1}/${qs.length}</span>
      </div>
      <div class="block"><p style="font-weight:700;font-size:17px">${esc(q.q)}${pyq}
        <span class="muted" style="font-weight:500"> · ${q.marks || 1} mark${(q.marks || 1) > 1 ? 's' : ''}</span></p></div>
      <div class="quiz-opts">${opts}</div>
      ${st.answered ? `<div class="explain"><b>Answer:</b> ${String.fromCharCode(65 + q.answer)}. ${esc(q.explain || '')}</div>
        <button class="btn mt js-next" data-ch="${ch.id}" data-total="${qs.length}">${st.i + 1 < qs.length ? 'Next question →' : 'See results →'}</button>` : ''}`;
  }

  return topbar('Chapter Quiz', ch.title, { back: `#/read/${cls.id}/${ch.id}` }) + `<main class="page">${body}</main>`;
}

/* -------------------------------------------------- PRACTICE hub */
function viewPractice() {
  const ready = allReadyChapters();
  const cards = ready.map(({ cls, ch }) => {
    const sc = Store.score(ch.id);
    return `<a class="chapter-row" href="#/quiz/${cls.id}/${ch.id}">
      <div class="chapter-row__num" style="background:${gradeColor(cls.grade)}22;color:${gradeColor(cls.grade)}">${cls.grade}</div>
      <div class="chapter-row__body">
        <h4>${esc(ch.title)}</h4>
        <p><span>${(ch.questions || []).filter(q => q.type !== 'subjective').length} questions</span>
          ${sc ? `<span class="tag tag--ready">Best ${sc.best}/${sc.total}</span>` : ''}</p>
      </div>
      <div class="chapter-row__chev">›</div>
    </a>`;
  }).join('');

  return topbar('Practice', 'Chapter-wise question bank') + `<main class="page">
    <div class="callout callout--exam"><div class="callout__label">🎯 About this bank</div>
      <p>These are exam-style <b>practice</b> questions mapped to each chapter. Authentic CBSE past-year questions can be imported into the same bank — see <a href="#/about" style="color:inherit;text-decoration:underline">About → Import PYQs</a>.</p></div>
    <div class="section-title">Pick a chapter</div>
    ${cards}
  </main>`;
}

/* -------------------------------------------------- BOOKMARKS */
function viewBookmarks() {
  const ids = Store.bookmarks();
  const found = ids.map(id => {
    for (const cls of CLASSES) for (const sub of cls.subjects) {
      const ch = sub.chapters.find(c => c.id === id);
      if (ch) return { cls, ch };
    }
    return null;
  }).filter(Boolean);

  const body = found.length ? found.map(({ cls, ch }) => `
    <a class="chapter-row" href="#/read/${cls.id}/${ch.id}">
      <div class="chapter-row__num">★</div>
      <div class="chapter-row__body"><h4>${esc(ch.title)}</h4><p><span>${esc(cls.title)}</span></p></div>
      <div class="chapter-row__chev">›</div>
    </a>`).join('')
    : empty('☆', 'No bookmarks yet', 'Tap the ☆ on any chapter to save it here for quick revision.');

  return topbar('Saved', 'Your bookmarked chapters') + `<main class="page">${body}</main>`;
}

/* -------------------------------------------------- SEARCH */
function viewSearch() {
  return topbar('Search', 'Find any topic') + `<main class="page">
    <div class="search-box">🔎 <input id="q" type="search" placeholder="Try “per capita income”, “GDP”, “MNC”…" autocomplete="off"></div>
    <div id="results" class="mt"></div>
  </main>`;
}

function runSearch(term) {
  const t = term.trim().toLowerCase();
  const box = document.getElementById('results');
  if (!box) return;
  if (t.length < 2) { box.innerHTML = `<p class="muted center mt">Type at least 2 letters…</p>`; return; }

  const hits = [];
  for (const cls of CLASSES) for (const sub of cls.subjects) for (const ch of sub.chapters) {
    if (ch.status !== 'ready') continue;
    const hay = [ch.title, ch.summary, ch.lead,
      ...(ch.keyTerms || []).flatMap(k => [k.term, k.def]),
      ...ch.lessons.flatMap(l => [l.title, ...l.blocks.flatMap(b => [b.text, b.label, ...(b.items || [])].filter(Boolean))])
    ].join(' ').toLowerCase();
    if (hay.includes(t)) {
      const snippet = makeSnippet(hay, t);
      hits.push({ cls, sub, ch, snippet });
    }
  }

  box.innerHTML = hits.length ? hits.map(h => `
    <a class="search-result" href="#/read/${h.cls.id}/${h.ch.id}">
      <div class="path">${esc(h.cls.title)} · ${esc(h.sub.title)}</div>
      <h4>${esc(h.ch.title)}</h4>
      <p>…${h.snippet}…</p>
    </a>`).join('')
    : empty('🤔', 'No matches', `Nothing found for “${esc(term)}”. Try another keyword.`);
}

function makeSnippet(hay, t) {
  const i = hay.indexOf(t);
  const start = Math.max(0, i - 40);
  const raw = hay.slice(start, i + t.length + 40);
  return esc(raw).replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>');
}

/* -------------------------------------------------- ABOUT / import */
function viewAbout() {
  const s = stats();
  return topbar('About ArthaPath') + `<main class="page">
    <div class="hero" style="background:radial-gradient(120% 140% at 0% 0%, #7c3aed, #1e3a8a 60%, #0d9488)">
      <div class="hero__glow">i</div>
      <h1>Free. Offline. Yours.</h1>
      <p>ArthaPath is a study companion for CBSE Economics, Classes 10–12. Every note, diagram and question lives inside the app — no login, no server, no cost.</p>
    </div>

    <div class="section-title">📊 What’s inside</div>
    <div class="class-grid">
      <div class="chapter-row"><div class="chapter-row__num">📚</div><div class="chapter-row__body"><h4>${s.chapters} chapters</h4><p><span>${s.ready} with full notes, more being added</span></p></div></div>
      <div class="chapter-row"><div class="chapter-row__num">❓</div><div class="chapter-row__body"><h4>${s.questions}+ questions</h4><p><span>Chapter-wise practice + PYQ import slot</span></p></div></div>
    </div>

    <div class="section-title">🎯 About the question bank</div>
    <div class="callout callout--exam"><div class="callout__label">🎯 Honest note</div>
      <p>Seeded questions are original, exam-style <b>practice</b> questions — clearly labelled. The app also supports importing <b>authentic CBSE past-year questions</b>. Real PYQs are never invented; they must come from genuine papers.</p></div>

    <div class="section-title">📥 How to import real PYQs</div>
    <div class="block"><p>Add a question object to any chapter’s <code>questions</code> array in <code>data/classXX.js</code>, marking it as a real past-year question:</p></div>
    <div class="tbl-wrap"><table class="data"><thead><tr><th>Field</th><th>Example</th></tr></thead><tbody>
      <tr><td>q</td><td>"Define per capita income."</td></tr>
      <tr><td>options</td><td>["…","…","…","…"]</td></tr>
      <tr><td>answer</td><td>0 (index of correct option)</td></tr>
      <tr><td>source</td><td>"pyq"</td></tr>
      <tr><td>year</td><td>2023</td></tr>
      <tr><td>marks</td><td>1</td></tr>
      <tr><td>explain</td><td>"Model answer / reason"</td></tr>
    </tbody></table></div>
    <div class="block"><p class="muted">Questions with <code>source:"pyq"</code> show a gold <span class="pyq-badge">PYQ</span> badge automatically. A CSV importer can be added later to bulk-load a full 10-year set.</p></div>

    <div class="section-title">⚙️ Data</div>
    <div class="btn-row"><button class="btn btn--ghost js-reset">🗑 Reset my progress</button></div>
    <p class="muted center" style="margin:14px 0 6px">NCERT is the source curriculum. This app provides original explanations and does not reproduce NCERT text verbatim.</p>
  </main>`;
}

/* -------------------------------------------------- media (admin uploads) */
function renderMedia(chapterId) {
  const items = extraMedia[chapterId];
  if (!items || !items.length) return '';
  const icon = t => ({ ppt: '📊', pdf: '📄', infographic: '🖼️', notes: '📝' }[t] || '📎');
  return `<div class="section-title">📎 Resources & slides</div>
    <div class="lab-res">${items.map(m =>
      `<a class="btn btn--ghost" href="${m.url}" target="_blank" rel="noopener">${icon(m.type)} ${esc(m.title)}</a>`).join('')}</div>`;
}

/* -------------------------------------------------- helpers */
function empty(ico, h, p) { return `<div class="empty"><div class="ico">${ico}</div><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`; }
function notFound() { return topbar('Not found', '', { back: '#/' }) + `<main class="page">${empty('🧭', 'Page not found', 'This content isn’t available yet.')}</main>`; }

/* -------------------------------------------------- events */
function wire() {
  document.querySelectorAll('.js-bookmark').forEach(b => b.addEventListener('click', () => {
    const on = Store.toggleBookmark(b.dataset.id);
    b.textContent = on ? '★' : '☆';
    b.classList.toggle('is-active', on);
  }));

  // Quiz option click
  document.querySelectorAll('.quiz-opt:not([disabled])').forEach(o => o.addEventListener('click', () => {
    const { name, params } = parseHash();
    if (name !== 'quiz') return;
    const found = findChapter(params[0], params[1]);
    const st = quizState[found.ch.id];
    const qs = found.ch.questions.filter(q => q.type !== 'subjective');
    st.picked = +o.dataset.idx;
    st.answered = true;
    if (st.picked === qs[st.i].answer) st.correct++;
    render();
  }));

  document.querySelectorAll('.js-next').forEach(b => b.addEventListener('click', () => {
    const st = quizState[b.dataset.ch];
    st.answered = false; st.picked = null; st.i++;
    if (st.i >= +b.dataset.total) st.done = true;
    render();
  }));

  document.querySelectorAll('.js-retry').forEach(b => b.addEventListener('click', () => {
    quizState[b.dataset.ch] = { i: 0, correct: 0, answered: false, done: false };
    render();
  }));

  // Q&A accordions inside notes (if any use .qa) — reserved
  document.querySelectorAll('.qa__q').forEach(q => q.addEventListener('click', () => q.parentElement.classList.toggle('open')));

  // Lesson nav smooth scroll
  document.querySelectorAll('.lesson-nav a').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({ behavior: 'smooth' });
    document.querySelectorAll('.lesson-nav a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
  }));

  // Search
  const q = document.getElementById('q');
  if (q) { q.focus(); q.addEventListener('input', () => runSearch(q.value)); }

  // Reset
  document.querySelectorAll('.js-reset').forEach(b => b.addEventListener('click', () => {
    if (confirm('Reset all your progress, bookmarks and scores?')) { Store.reset(); location.hash = '#/'; render(); }
  }));
}

/* -------------------------------------------------- boot */
render();
// After first paint, pull any admin edits / uploaded media from the cloud
// (no-op when offline or not configured), then repaint.
syncFromCloud(() => render());
