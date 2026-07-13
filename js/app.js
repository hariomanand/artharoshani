import { CLASSES, byClass, findChapter, allReadyChapters, stats } from '../data/index.js';
import { renderBlocks } from './blocks.js';
import { Store } from './store.js';
import { renderLabsHub, renderLab, wireLabs, renderCatalogue, renderCatalogueLab } from './labs.js';
import { labById, LABS } from '../data/labs.js';
import { CATALOGUE, TRACK_META } from '../data/catalogue.js';
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
  courses: viewCourses,
  students: viewStudents,
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
  let active = name;
  if (['lab', 'catalogue', 'lab-item'].includes(name)) active = 'labs';
  if (['class', 'read', 'quiz'].includes(name)) active = 'class';
  app.innerHTML = siteHeader(active) + view(params) + siteFooter();
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

const brandMark = `<span class="brand__mark">₹</span> <span>Artha<b>Roshni</b></span>`;

function siteHeader(active) {
  const link = (n, href, label) => `<a class="nav-link ${active === n ? 'active' : ''}" href="${href}">${label}</a>`;
  const dd = CLASSES.map(c => `<a class="nav-dd__item" href="#/class/${c.id}">
    <span class="ic" style="background:${c.color}">${c.grade}</span>
    <span><b>${esc(c.title)}</b><small>${esc(c.subtitle)}</small></span></a>`).join('');
  return `<header class="site-nav"><div class="site-nav__in">
    <a class="brand" href="#/">${brandMark}</a>
    <nav class="nav-links">
      <div class="nav-dd">
        <a class="nav-link ${active === 'class' ? 'active' : ''}" href="#/courses">Courses ▾</a>
        <div class="nav-dd__panel">${dd}
          <a class="nav-dd__item" href="#/courses"><span class="ic" style="background:var(--brand)">▤</span><span><b>All courses</b><small>Browse the full catalogue</small></span></a>
        </div>
      </div>
      ${link('labs', '#/labs', 'Labs')}
      ${link('catalogue', '#/catalogue', '500 Labs')}
      ${link('practice', '#/practice', 'Practice')}
      ${link('students', '#/students', 'For Students')}
      ${link('about', '#/about', 'About')}
    </nav>
    <div class="nav-right">
      <form class="nav-search js-navsearch"><span>🔎</span><input placeholder="Search topics…"></form>
      <a class="c-btn c-btn--primary" href="#/courses">Start free</a>
      <button class="nav-toggle js-navtoggle" aria-label="Menu">☰</button>
    </div>
  </div>
  <div class="mobile-menu js-mobilemenu">
    <a href="#/courses">Courses</a>
    ${CLASSES.map(c => `<a href="#/class/${c.id}">— ${esc(c.title)}</a>`).join('')}
    <a href="#/labs">Labs</a><a href="#/catalogue">500 Labs</a><a href="#/practice">Practice</a>
    <a href="#/students">For Students</a><a href="#/about">About</a><a href="#/search">Search</a>
    <a class="c-btn c-btn--primary" href="#/courses">Start free</a>
  </div></header>`;
}

function siteFooter() {
  return `<footer class="site-footer">
    <div class="site-footer__in">
      <div class="site-footer__brand"><a class="brand" href="#/">${brandMark}</a>
        <p>Free, world-class economics learning for every student — Class 10 to college. Notes, technical labs, quizzes & research skills at zero cost.</p></div>
      <div><h5>Learn</h5><a href="#/courses">All courses</a><a href="#/class/class-10">Class 10</a><a href="#/class/class-11">Class 11</a><a href="#/class/class-12">Class 12</a><a href="#/practice">Practice</a></div>
      <div><h5>Labs</h5><a href="#/labs">Technical Labs</a><a href="#/catalogue">500-Lab Catalogue</a><a href="#/lab/econometrics">Econometrics</a><a href="#/lab/sentiment">Sentiment Analysis</a><a href="#/lab/behavioral">Behavioral</a></div>
      <div><h5>ArthaRoshni</h5><a href="#/about">About</a><a href="#/students">For Students</a><a href="ArthaRoshni-500-Labs-Catalogue.pdf" target="_blank" rel="noopener">Download PDF</a><a href="admin.html">Admin</a></div>
      <div><h5>Resources</h5><a href="#/search">Search</a><a href="#/bookmarks">Saved</a><a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener">NCERT books</a><a href="https://colab.research.google.com" target="_blank" rel="noopener">Google Colab</a></div>
    </div>
    <div class="site-footer__bar"><div class="site-footer__bar-in">
      <span>© 2026 ArthaRoshni · by Roshani — free for education.</span>
      <span>Built for the students of India 🇮🇳</span>
    </div></div>
  </footer>`;
}

/* -------------------------------------------------- course card helper */
function courseCard({ href, color, icon, tag, kick, title, desc, meta, rating }) {
  return `<a class="course-card" href="${href}">
    <div class="course-card__top" style="background:linear-gradient(135deg, ${color}, ${color}bb)">
      <span class="course-card__tag">${esc(tag)}</span>${icon}
    </div>
    <div class="course-card__body">
      <div class="kick">${esc(kick)}</div>
      <h3>${esc(title)}</h3>
      <p>${esc(desc)}</p>
      <div class="course-card__foot">
        <span class="course-card__meta"><span class="star">★ ${rating || '4.9'}</span> · ${esc(meta)}</span>
        <span class="free">Free</span>
      </div>
    </div>
  </a>`;
}

/* -------------------------------------------------- HOME (marketing) */
function viewHome() {
  const s = stats();
  const classCards = CLASSES.map(c => courseCard({
    href: `#/class/${c.id}`, color: c.color, icon: `<b style="font-size:40px">${c.grade}</b>`,
    tag: `Class ${c.grade}`, kick: 'CBSE · NCERT-aligned', title: c.title, desc: c.subtitle,
    meta: `${c.subjects.flatMap(su => su.chapters).length} chapters`,
  })).join('');
  const labCards = LABS.slice(0, 3).map(l => courseCard({
    href: `#/lab/${l.id}`, color: l.color, icon: l.icon, tag: 'Lab', kick: l.level,
    title: l.title, desc: l.tagline, meta: 'Interactive',
  })).join('');

  const pills = [
    ['#/class/class-10', '📗 Class 10'], ['#/class/class-11', '📘 Class 11'], ['#/class/class-12', '📙 Class 12'],
    ['#/lab/econometrics', '📈 Econometrics'], ['#/lab/sentiment', '🗣️ Sentiment Analysis'],
    ['#/lab/python-econ', '🐍 Python'], ['#/lab/behavioral', '🧠 Behavioral'], ['#/catalogue', '🔬 500 Labs'],
  ].map(([h, l]) => `<a class="pill" href="${h}">${l}</a>`).join('');

  return `
  <section class="mkt-hero"><div class="mkt-hero__in">
    <div>
      <div class="hero__badge" style="background:var(--primary-soft);color:var(--brand)">🎓 CBSE · NCERT-aligned · 100% free</div>
      <h1>Learn economics<br>the way <em>top universities</em> teach it.</h1>
      <p class="sub">Notes, PPTs, quizzes and <b>500 hands-on technical labs</b> — econometrics, Python, sentiment analysis and more. For Class 10–12 and beyond. Always free.</p>
      <div class="mkt-hero__cta">
        <a class="c-btn c-btn--primary c-btn--lg" href="#/courses">Explore courses</a>
        <a class="c-btn c-btn--outline c-btn--lg" href="#/labs">Try a lab →</a>
      </div>
      <div class="mkt-hero__trust">
        <div><b>${s.chapters}</b> Chapters</div>
        <div><b>500+</b> Technical labs</div>
        <div><b>${s.questions}+</b> Questions</div>
        <div><b>₹0</b> Forever</div>
      </div>
    </div>
    <div class="mkt-hero__art"><div class="mkt-hero__card">
      <h4>What you’ll master</h4>
      <div class="mkt-hero__stat"><span class="n" style="background:var(--primary-soft)">📈</span><span><b>Econometrics & regression</b><br><span>Run real models on Indian data</span></span></div>
      <div class="mkt-hero__stat"><span class="n" style="background:var(--accent-soft)">🗣️</span><span><b>Sentiment analysis</b><br><span>Measure the tone of RBI & budget text</span></span></div>
      <div class="mkt-hero__stat"><span class="n" style="background:#ede9fe">🧠</span><span><b>Behavioral experiments</b><br><span>Play & analyse economic games</span></span></div>
    </div></div>
  </div></section>

  <div class="mkt-search"><div class="mkt-search__box">
    <span style="font-size:20px">🔎</span>
    <input class="js-homesearch" placeholder="Search notes, topics & labs — “GDP”, “regression”, “sentiment”…">
    <a class="c-btn c-btn--primary js-homesearch-btn" href="#/search">Search</a>
  </div></div>

  <section class="mkt-sec">
    <div class="mkt-sec__head"><div><h2>Browse by topic</h2><p>Jump straight to what you need.</p></div></div>
    <div class="pill-row">${pills}</div>
  </section>

  <section class="mkt-sec" style="padding-top:0">
    <div class="mkt-sec__head"><div><h2>Class courses</h2><p>Full NCERT-aligned notes, infographics & quizzes.</p></div><a class="c-btn c-btn--ghost" href="#/courses">View all</a></div>
    <div class="course-grid">${classCards}</div>
  </section>

  <div class="band"><div class="band__in">
    <div class="band__stat"><b>500+</b><span>Technical labs to build</span></div>
    <div class="band__stat"><b>${s.chapters}</b><span>NCERT chapters</span></div>
    <div class="band__stat"><b>10</b><span>Skill tracks</span></div>
    <div class="band__stat"><b>₹0</b><span>Cost, forever</span></div>
  </div></div>

  <section class="mkt-sec">
    <div class="mkt-sec__head"><div><h2>Featured technical labs</h2><p>University-style facilities, free in your browser.</p></div><a class="c-btn c-btn--ghost" href="#/labs">All labs</a></div>
    <div class="course-grid">${labCards}</div>
  </section>

  <section class="mkt-sec" style="padding-top:0">
    <div class="mkt-sec__head"><div><h2>Why ArthaRoshni</h2><p>Everything a serious economics student needs.</p></div></div>
    <div class="feature-grid">
      <div class="feature"><div class="ic">📖</div><h3>Clear, visual notes</h3><p>Every chapter explained with infographics, connector diagrams, tables and key terms — not walls of text.</p></div>
      <div class="feature"><div class="ic">🔬</div><h3>Real research skills</h3><p>500 labs teach Python, econometrics, NLP and behavioral experiments — the tools top universities charge lakhs for.</p></div>
      <div class="feature"><div class="ic">📝</div><h3>Practice that sticks</h3><p>Chapter-wise quizzes with instant feedback and a real-PYQ import slot to prepare for boards.</p></div>
      <div class="feature"><div class="ic">📴</div><h3>Works offline</h3><p>Install it like an app. Learn on any phone, even with a weak connection.</p></div>
      <div class="feature"><div class="ic">🌍</div><h3>Global standard, local focus</h3><p>Modelled on MIT, ETH Zurich & Berkeley labs — taught with Indian data and examples.</p></div>
      <div class="feature"><div class="ic">💛</div><h3>Free, forever</h3><p>No fees, no login walls. Built so cost is never a barrier to world-class learning.</p></div>
    </div>
  </section>

  <section class="cta-band"><div class="cta-band__in">
    <h2>Start learning today — it’s free</h2>
    <p>Join thousands of students building real economics skills. No sign-up needed to begin.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
      <a class="c-btn c-btn--white c-btn--lg" href="#/courses">Browse courses</a>
      <a class="c-btn c-btn--lg" style="background:rgba(255,255,255,.15);color:#fff;border:1.5px solid rgba(255,255,255,.5)" href="#/catalogue">See all 500 labs</a>
    </div>
  </div></section>`;
}

/* -------------------------------------------------- COURSES catalog */
function viewCourses() {
  const classCards = CLASSES.map(c => courseCard({
    href: `#/class/${c.id}`, color: c.color, icon: `<b style="font-size:40px">${c.grade}</b>`,
    tag: `Class ${c.grade}`, kick: 'CBSE · NCERT-aligned', title: c.title, desc: c.subtitle,
    meta: `${c.subjects.flatMap(su => su.chapters).length} chapters`,
  })).join('');
  const subjectCards = CLASSES.flatMap(c => c.subjects.map(su => courseCard({
    href: `#/class/${c.id}`, color: su.color || c.color, icon: '📚', tag: `Class ${c.grade}`,
    kick: c.title, title: su.title, desc: su.note || '', meta: `${su.chapters.length} chapters`,
  }))).join('');
  const trackCards = TRACK_META.map(t => {
    const n = CATALOGUE.filter(l => l.trackKey === t.key).length;
    return courseCard({ href: `#/catalogue`, color: t.color, icon: t.icon, tag: 'Lab track',
      kick: 'Technical Lab', title: t.name, desc: `${n} hands-on labs to build and run for free.`, meta: `${n} labs` });
  }).join('');

  return `
  <section class="mkt-hero"><div class="mkt-hero__in" style="grid-template-columns:1fr">
    <div>
      <div class="hero__badge" style="background:var(--primary-soft);color:var(--brand)">📚 All courses</div>
      <h1 style="font-size:42px">The full ArthaRoshni catalogue</h1>
      <p class="sub" style="max-width:60ch">Class courses, subject tracks and 500 technical labs — every one free. Pick a class to get notes & quizzes, or a lab track to build research skills.</p>
    </div>
  </div></section>

  <section class="mkt-sec">
    <div class="mkt-sec__head"><div><h2>By class</h2><p>NCERT-aligned notes, infographics & quizzes.</p></div></div>
    <div class="course-grid">${classCards}</div>
  </section>
  <section class="mkt-sec" style="padding-top:0">
    <div class="mkt-sec__head"><div><h2>By subject</h2></div></div>
    <div class="course-grid">${subjectCards}</div>
  </section>
  <section class="mkt-sec" style="padding-top:0">
    <div class="mkt-sec__head"><div><h2>Technical lab tracks</h2><p>10 tracks · 500 labs. From first Python steps to advanced econometrics.</p></div><a class="c-btn c-btn--ghost" href="#/catalogue">Open catalogue</a></div>
    <div class="course-grid">${trackCards}</div>
  </section>`;
}

/* -------------------------------------------------- FOR STUDENTS */
function viewStudents() {
  return `
  <section class="mkt-hero"><div class="mkt-hero__in">
    <div>
      <div class="hero__badge" style="background:var(--primary-soft);color:var(--brand)">🎓 For students</div>
      <h1>Your path from<br>Class 10 to <em>research-ready</em>.</h1>
      <p class="sub">Whether you’re revising for boards or dreaming of a top university, ArthaRoshni gives you the notes, practice and real technical skills to get there — free.</p>
      <div class="mkt-hero__cta"><a class="c-btn c-btn--primary c-btn--lg" href="#/courses">Start with your class</a></div>
    </div>
    <div class="mkt-hero__art"><div class="mkt-hero__card">
      <h4>A simple 3-step path</h4>
      <div class="mkt-hero__stat"><span class="n" style="background:var(--primary-soft)">1</span><span><b>Learn the concept</b><br><span>Visual notes for every chapter</span></span></div>
      <div class="mkt-hero__stat"><span class="n" style="background:var(--accent-soft)">2</span><span><b>Practice & test</b><br><span>Quizzes with instant feedback</span></span></div>
      <div class="mkt-hero__stat"><span class="n" style="background:#ede9fe">3</span><span><b>Build real skills</b><br><span>Run labs like a researcher</span></span></div>
    </div></div>
  </div></section>

  <section class="mkt-sec">
    <div class="mkt-sec__head"><div><h2>How it works</h2></div></div>
    <div class="steps-3">
      <div class="step-c"><div class="num">1</div><h3>Pick your class</h3><p>Class 10, 11 or 12 — get NCERT-aligned notes with infographics and diagrams.</p></div>
      <div class="step-c"><div class="num">2</div><h3>Practise & revise</h3><p>Take chapter quizzes, save chapters, and track what you’ve learned.</p></div>
      <div class="step-c"><div class="num">3</div><h3>Go beyond the syllabus</h3><p>Open the technical labs and start doing real economics research with free tools.</p></div>
    </div>
  </section>

  <section class="mkt-sec" style="padding-top:0">
    <div class="mkt-sec__head"><div><h2>Built for every student</h2></div></div>
    <div class="feature-grid">
      <div class="feature"><div class="ic">📱</div><h3>Any device</h3><p>Works on a basic phone, offline, installable to your home screen.</p></div>
      <div class="feature"><div class="ic">🧑‍🏫</div><h3>No coaching needed</h3><p>Self-paced, clearly explained, and free of cost.</p></div>
      <div class="feature"><div class="ic">🔬</div><h3>Future-ready</h3><p>Learn Python, data & AI skills that universities and employers value.</p></div>
    </div>
  </section>

  <section class="cta-band"><div class="cta-band__in">
    <h2>Your future starts with one chapter</h2>
    <p>No fees. No sign-up. Just open a course and begin.</p>
    <a class="c-btn c-btn--white c-btn--lg" href="#/courses">Browse courses</a>
  </div></section>`;
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
  return topbar('About ArthaRoshni') + `<main class="page">
    <div class="hero" style="background:radial-gradient(120% 140% at 0% 0%, #7c3aed, #1e3a8a 60%, #0d9488)">
      <div class="hero__glow">i</div>
      <h1>Free. Offline. Yours.</h1>
      <p>ArthaRoshni is a study companion for CBSE Economics, Classes 10–12. Every note, diagram and question lives inside the app — no login, no server, no cost.</p>
      <p style="margin-top:10px;font-size:13px;opacity:.85">Created with ❤️ by <b>Roshani</b> — to bring world-class economics to every student.</p>
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
  // Mobile menu toggle
  const tgl = document.querySelector('.js-navtoggle');
  if (tgl) tgl.addEventListener('click', () => document.querySelector('.js-mobilemenu')?.classList.toggle('open'));

  // Navbar + home search -> go to search page with query
  const goSearch = val => { location.hash = '#/search'; setTimeout(() => { const q = document.getElementById('q'); if (q) { q.value = val; q.dispatchEvent(new Event('input')); } }, 0); };
  const ns = document.querySelector('.js-navsearch');
  if (ns) ns.addEventListener('submit', e => { e.preventDefault(); goSearch(ns.querySelector('input').value); });
  const hs = document.querySelector('.js-homesearch');
  if (hs) {
    const trigger = () => goSearch(hs.value);
    hs.addEventListener('keydown', e => { if (e.key === 'Enter') trigger(); });
    document.querySelector('.js-homesearch-btn')?.addEventListener('click', e => { e.preventDefault(); trigger(); });
  }

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
