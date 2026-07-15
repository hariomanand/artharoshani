import { CLASSES, byClass, findChapter, allReadyChapters, stats } from '../data/index.js';
import { renderBlocks } from './blocks.js';
import { Store } from './store.js';
import { renderLabsHub, renderLab, wireLabs, renderCatalogue, renderCatalogueLab, setDownloadHandler } from './labs.js';
import { getSupabase } from './supabase.js';
import { labById, LABS } from '../data/labs.js';
import { CATALOGUE, TRACK_META } from '../data/catalogue.js';
import { syncFromCloud, extraMedia } from './content.js';
// TESTIMONIALS is intentionally not imported: the homepage testimonial section was
// removed because those quotes were placeholders from the design mock, not real
// students. data/site.js keeps them for when real, attributable ones exist.
import { HOME_COURSES, CERTS, CLASS_FEATURES, PLATFORM_FEATURES, CAREERS, TEACHERS, SOURCES } from '../data/site.js';
import { POSTS, postById } from '../data/blog.js';
import { icon } from './icons.js';
import { renderBlueprint, wireBlueprint } from './blueprint.js';
import { BP_CHAPTERS } from '../data/blueprint.js';
import { QBANK, QBANK_TOTAL, qbFind } from '../data/qbank.js';
import { buildOptions } from './mcq.js';
import {
  Auth, wireAuth, viewLogin, viewSignup as viewAuthSignup, viewVerify,
  viewForgot, viewReset, viewLocked,
} from './auth.js';

const app = document.getElementById('app');
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const gradeColor = g => ({ '10': 'var(--c10)', '11': 'var(--c11)', '12': 'var(--c12)' }[g] || 'var(--primary)');

/* -------------------------------------------------- routing */
function parseHash() {
  const h = location.hash.replace(/^#\/?/, '');
  const parts = h.split('/').filter(Boolean);
  return { name: parts[0] || 'home', params: parts.slice(1) };
}

// Every lab route is gated. Chapter notes, quizzes, the Blueprint and all
// marketing pages stay public so they remain indexable and work offline.
function gated(view, what) {
  return params => {
    if (Auth.isAuthed()) return view(params);
    const back = '#/' + [parseHash().name].concat(params).join('/');
    try { sessionStorage.setItem('ar.returnTo', back); } catch { /* private mode */ }
    return viewLocked(back, what);
  };
}

const routes = {
  home: viewHome,
  class: viewClass,
  read: viewRead,
  quiz: viewQuiz,
  practice: viewPractice,
  qbank: viewQBank,
  bookmarks: viewBookmarks,
  search: viewSearch,
  about: viewAbout,
  labs: gated(viewLabs, 'the labs'),
  lab: gated(viewLab, 'this lab'),
  catalogue: gated(viewCatalogue, 'the 500-lab catalogue'),
  'lab-item': gated(viewCatalogueLab, 'this lab'),
  courses: viewCourses,
  students: viewStudents,
  certifications: viewCertifications,
  cert: viewCert,
  blogs: viewBlogs,
  blog: viewBlogPost,
  blueprint: viewBlueprint,
  // auth
  login: viewLogin,
  signup: p => viewAuthSignup(p[0] ? decodeURIComponent(p[0]) : '#/labs'),
  verify: viewVerify,
  forgot: viewForgot,
  reset: viewReset,
  account: viewAccount,
};

function viewBlueprint([chapterId]) { return renderBlueprint(chapterId); }

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
  if (['class', 'read', 'quiz', 'blueprint'].includes(name)) active = 'courses';
  if (name === 'qbank') active = 'practice';
  if (name === 'blog') active = 'blogs';
  if (name === 'cert') active = 'certifications';
  app.innerHTML = siteHeader(active) + view(params) + siteFooter();
  window.scrollTo(0, 0);
  wire();
  wireLabs();
  wireBlueprint();
}
window.addEventListener('hashchange', render);
window.addEventListener('scroll', () => {
  document.querySelector('.js-sitenav')?.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

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

const brandMark = `<span class="brand__mark">₹</span><span class="brand__text"><b>ArthaRoshni</b><small>CBSE Economics · Classes 10–12</small></span>`;

/* Navbar — every top item has its own custom SVG icon + a dropdown whose
   entries each lead to their own page. */
const NAV = [
  {
    key: 'courses', label: 'Courses', href: '#/courses', icon: 'courses',
    menu: [
      { icon: 'class10', t: 'Class 10 Economics', d: 'Development, sectors, money & credit', href: '#/class/class-10' },
      { icon: 'class11', t: 'Class 11 Economics', d: 'Statistics + micro foundations', href: '#/class/class-11' },
      { icon: 'class12', t: 'Class 12 Economics', d: 'Macro + Indian Economic Development', href: '#/class/class-12' },
      { icon: 'compass', t: "India's Economic Blueprint", d: 'Interactive 8-chapter special', href: '#/blueprint', hot: true },
      { icon: 'grid', t: 'All courses', d: 'The complete catalogue', href: '#/courses' },
    ],
  },
  {
    key: 'certifications', label: 'Certifications', href: '#/certifications', icon: 'certifications',
    menu: [
      { icon: 'class10', t: 'ACE-10 · CBSE 10 Achiever', d: 'Complete Class 10, quiz by quiz', href: '#/cert/ace-10' },
      { icon: 'class11', t: 'ACE-11 · Stats & Micro', d: 'The Class 11 dual path', href: '#/cert/ace-11' },
      { icon: 'class12', t: 'ACE-12 · Macro & IED Master', d: 'The board-decider path', href: '#/cert/ace-12' },
      { icon: 'medal', t: 'ACE-PRO · Research & Labs', d: 'Python, data & econometrics', href: '#/cert/ace-pro' },
      { icon: 'grid', t: 'All certification paths', d: 'Compare the four paths', href: '#/certifications' },
    ],
  },
  {
    key: 'labs', label: 'Labs', href: '#/labs', icon: 'labs',
    menu: [
      { icon: 'scatter', t: 'Econometrics Lab', d: 'Run real OLS regressions', href: '#/lab/econometrics' },
      { icon: 'code', t: 'Python for Economics', d: 'pandas, NumPy & Colab', href: '#/lab/python-econ' },
      { icon: 'sliders', t: 'Market Simulator', d: 'Drag supply & demand live', href: '#/lab/data-viz' },
      { icon: 'chat', t: 'Sentiment Analysis', d: 'Text-as-data, in your browser', href: '#/lab/sentiment' },
      { icon: 'brain', t: 'Behavioral Economics', d: 'Play the ultimatum game', href: '#/lab/behavioral' },
      { icon: 'grid', t: '500-Lab Master Catalogue', d: '10 tracks · every lab free', href: '#/catalogue', hot: true },
    ],
  },
  {
    key: 'practice', label: 'Practice', href: '#/practice', icon: 'practice',
    menu: [
      { icon: 'checkSquare', t: 'Chapter quiz bank', d: 'Instant-feedback questions', href: '#/practice' },
      { icon: 'bookmark', t: 'Saved chapters', d: 'Your bookmarks, one tap away', href: '#/bookmarks' },
      { icon: 'search', t: 'Search any topic', d: 'Every note, term & diagram', href: '#/search' },
      { icon: 'star', t: 'Import real PYQs', d: 'How the PYQ badge works', href: '#/about' },
    ],
  },
  {
    key: 'blogs', label: 'Blogs', href: '#/blogs', icon: 'blogs',
    menu: [
      { icon: 'file', t: 'NCERT revision plan', d: '30 days to board-ready', href: '#/blog/ncert-revision-plan-2026' },
      { icon: 'rupee', t: 'Union Budget, explained', d: 'For Class 12 economics', href: '#/blog/union-budget-2025-26-class-12' },
      { icon: 'code', t: 'Python for econ students', d: 'Your first data notebook', href: '#/blog/python-for-economics-students' },
      { icon: 'grid', t: 'All articles', d: 'The full ArthaRoshni blog', href: '#/blogs' },
    ],
  },
  {
    key: 'about', label: 'About', href: '#/about', icon: 'about',
    menu: [
      { icon: 'heart', t: 'About ArthaRoshni', d: 'Free. Offline. Yours.', href: '#/about' },
      { icon: 'gradcap', t: 'For students', d: 'From Class 10 to research-ready', href: '#/students' },
      { icon: 'compass', t: "India's Economic Blueprint", d: 'The interactive special', href: '#/blueprint' },
    ],
  },
];

function dropPanel(item) {
  return `<div class="nav-drop" role="menu">
    ${item.menu.map(m => `
      <a class="nav-drop__item ${m.hot ? 'hot' : ''}" href="${m.href}" role="menuitem">
        <span class="nav-drop__ic">${icon(m.icon, 20)}</span>
        <span class="nav-drop__tx"><b>${m.t}</b><small>${m.d}</small></span>
        <span class="nav-drop__go">${icon('arrow', 14)}</span>
      </a>`).join('')}
  </div>`;
}

function siteHeader(active) {
  const links = NAV.map(item => `
    <div class="nav-item ${active === item.key ? 'is-active' : ''}">
      <a class="nav-link ${active === item.key ? 'active' : ''}" href="${item.href}">
        ${icon(item.icon, 16)}<span>${item.label}</span>${icon('chevron', 12, 'nav-link__chev')}
      </a>
      ${dropPanel(item)}
    </div>`).join('');

  const mobileGroups = NAV.map(item => `
    <div class="mm-group">
      <button class="mm-group__head js-mmgroup" type="button">
        ${icon(item.icon, 17)}<span>${item.label}</span>${icon('chevron', 14, 'mm-chev')}
      </button>
      <div class="mm-group__body">
        <a class="mm-main" href="${item.href}">${icon('arrow', 13)} Open ${item.label}</a>
        ${item.menu.map(m => `<a href="${m.href}">${icon(m.icon, 15)} ${m.t}</a>`).join('')}
      </div>
    </div>`).join('');

  return `
  <div class="announce"><div class="announce__in">
    <div class="announce__msg"><span class="announce__new">New</span>
      <span><span class="announce__track">
        <span>India's Economic Blueprint — an interactive 8-chapter journey from 1947 to a $5-trillion future.</span>
        <span aria-hidden="true">India's Economic Blueprint — an interactive 8-chapter journey from 1947 to a $5-trillion future.</span>
      </span></span></div>
    <a class="announce__cta" href="#/blueprint">Explore the Blueprint <span class="announce__arrow">→</span></a>
  </div></div>
  <header class="site-nav js-sitenav"><div class="site-nav__in">
    <a class="brand" href="#/">${brandMark}</a>
    <nav class="nav-links">${links}</nav>
    <div class="nav-right">
      <form class="nav-search js-navsearch" role="search">
        ${icon('search', 16)}<input type="search" placeholder="Search" aria-label="Search topics">
      </form>
      <a class="nav-icon js-searchicon" href="#/search" aria-label="Search">${icon('search', 18)}</a>
      ${Auth.isAuthed()
        ? `<a class="nav-login" href="#/account">${icon('user', 16)}<span>${esc((Auth.displayName() || '').split(' ')[0] || 'Account')}</span></a>`
        : `<a class="nav-login" href="#/login">${icon('user', 16)}<span>Log In</span></a>`}
      <a class="c-btn c-btn--startfree" href="${Auth.isAuthed() ? '#/labs' : '#/signup'}">${Auth.isAuthed() ? 'Open Labs' : 'Start Free'}</a>
      <button class="nav-toggle js-navtoggle" aria-label="Menu">${icon('menu', 22)}</button>
    </div>
  </div>
  <div class="mobile-menu js-mobilemenu">
    <form class="nav-search nav-search--mobile js-navsearch" role="search">
      ${icon('search', 16)}<input type="search" placeholder="Search any topic…" aria-label="Search topics">
    </form>
    ${mobileGroups}
    <a class="mm-flat" href="#/blueprint">${icon('compass', 17)} India's Economic Blueprint</a>
    <div class="mm-actions">
      ${Auth.isAuthed()
        ? `<a class="c-btn c-btn--startfree" href="#/account">${icon('user', 15)} ${esc(Auth.displayName())}</a>
           <a class="c-btn c-btn--primary" href="#/labs">Open Labs</a>`
        : `<a class="c-btn c-btn--startfree" href="#/login">${icon('user', 15)} Log In</a>
           <a class="c-btn c-btn--primary" href="#/signup">Start Free</a>`}
    </div>
  </div></header>`;
}

const SOCIALS = [
  ['Facebook', 'M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07c0 6 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.02 24 18.06 24 12.07z'],
  ['Twitter', 'M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z'],
  ['Instagram', 'M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.7 21.3.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.41-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z'],
  ['YouTube', 'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12z'],
  ['LinkedIn', 'M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z'],
];

function siteFooter() {
  const socials = SOCIALS.map(([label, d]) =>
    `<a href="#/" aria-label="${label}"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="${d}"/></svg></a>`).join('');
  return `<footer class="site-footer">
    <div class="nl-band"><div class="nl-band__in">
      <div>
        <h3>Get the 500-Lab Catalogue — free.</h3>
        <p>All 10 tracks — Python, econometrics, NLP, behavioral and more. Create your free account to explore every lab.</p>
      </div>
      <div class="nl-band__actions">
        <a class="c-btn c-btn--primary c-btn--lg" href="#/catalogue">Explore the Catalogue ${icon('arrow', 15)}</a>
      </div>
    </div></div>
    <div class="site-footer__in">
      <div class="site-footer__brand"><a class="brand" href="#/"><span class="brand__mark">₹</span><b style="margin-left:2px">ArthaRoshni</b></a>
        <p>India's free learning platform for CBSE Economics — Classes 10, 11 & 12. Notes, quizzes and 500 technical labs, at zero cost, offline-ready.</p>
        <div class="site-footer__social">${socials}</div>
      </div>
      <div><h5>Courses</h5><a href="#/courses">All courses</a><a href="#/class/class-10">Class 10 Economics</a><a href="#/class/class-11">Class 11 Statistics & Micro</a><a href="#/class/class-12">Class 12 Macro & IED</a><a href="#/blueprint">India's Economic Blueprint</a><a href="#/certifications">Certifications</a></div>
      <div><h5>Labs</h5><a href="#/labs">Technical Labs</a><a href="#/catalogue">500-Lab Catalogue</a><a href="#/lab/econometrics">Econometrics</a><a href="#/lab/sentiment">Sentiment Analysis</a></div>
      <div><h5>Resources</h5><a href="#/practice">Practice quizzes</a><a href="#/blogs">Blog</a><a href="#/search">Search</a><a href="#/bookmarks">Saved chapters</a><a href="https://ncert.nic.in/textbook.php" target="_blank" rel="noopener">NCERT textbooks</a></div>
      <div><h5>Company</h5><a href="#/about">About ArthaRoshni</a><a href="#/students">For Students</a><a href="#/blogs">Blog</a></div>
    </div>
    <div class="site-footer__bar"><div class="site-footer__bar-in">
      <span>© 2026 ArthaRoshni · by Roshani — free for education. Built for the students of India 🇮🇳</span>
      <span class="links"><a href="#/about">About</a><a href="#/blogs">Blog</a><a href="#/search">Sitemap</a></span>
    </div></div>
  </footer>`;
}

/* -------------------------------------------------- course card helper */
function courseCard({ href, color, grad, icon, tag, kick, title, desc, meta, rating, tags }) {
  const top = grad ? `class="course-card__top ${grad}"` :
    `class="course-card__top" style="background:linear-gradient(135deg, ${color}, ${color}bb)"`;
  const tagChips = (tags || []).length
    ? `<div class="course-card__tags">${tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>` : '';
  return `<a class="course-card" href="${href}">
    <div ${top}><span class="course-card__tag">${esc(tag)}</span>${icon}</div>
    <div class="course-card__body">
      <div class="kick">${esc(kick)}</div>
      <h3>${esc(title)}</h3>
      <p>${esc(desc)}</p>
      ${tagChips}
      <div class="course-card__foot">
        <span class="course-card__meta"><span class="star">★ ${rating || '4.9'}</span> · ${esc(meta)}</span>
        <span class="free">Free</span>
      </div>
    </div>
  </a>`;
}

/* -------------------------------------------------- shared marketing partials */
function certCard(c) {
  return `<a class="cert-card" href="#/cert/${c.id}">
    <div class="cert-card__banner ${c.grad}">
      <div><div class="k">CERTIFICATE PATH</div><div class="code">${esc(c.code)}</div></div>
      <span class="cert-card__verified">FREE</span>
    </div>
    <div class="cert-card__body">
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.subtitle)}</p>
      <div class="cert-card__tags">${c.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
    </div>
  </a>`;
}

function blogCard(p) {
  return `<a class="blog-card" href="#/blog/${p.id}">
    <div class="blog-card__art ${p.grad}">${p.icon}</div>
    <div class="blog-card__body">
      <div class="kick">${esc(p.kicker)}</div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.excerpt)}</p>
      <div class="blog-meta"><span>${esc(p.date)}</span><span>·</span><span>${p.mins} min read</span></div>
    </div>
  </a>`;
}

/* -------------------------------------------------- HOME (marketing) */
let homeCourseTab = 'all';       // all | class-10 | class-11 | class-12
let homeClassTab = 'class-10';   // class features section

function homeCourseCards() {
  const list = homeCourseTab === 'all' ? HOME_COURSES : HOME_COURSES.filter(c => c.cls === homeCourseTab);
  return list.slice(0, 6).map(c => courseCard({
    href: `#/class/${c.cls}`, grad: c.grad, icon: icon(c.icon, 44),
    tag: `Class ${c.grade}`, kick: `${c.duration} · CBSE · NCERT`, title: c.title,
    desc: c.desc, meta: 'Notes + quiz', rating: c.rating, tags: c.tags,
  })).join('');
}

function classFeaturesSection() {
  const cls = byClass[homeClassTab];
  const f = CLASS_FEATURES[homeClassTab];
  const chapters = cls.subjects.flatMap(su => su.chapters).slice(0, 10);
  const tabs = CLASSES.map(c =>
    `<button class="tab tab--card js-classtab ${homeClassTab === c.id ? 'active' : ''}" data-cls="${c.id}">Class ${c.grade}</button>`).join('');
  const bullets = f.bullets.map(b => `<div class="check-item"><span class="ck">✓</span>
    <div><b>${esc(b.title)}</b><span>${esc(b.desc)}</span></div></div>`).join('');
  const rows = chapters.map((ch, i) => {
    const ready = ch.status === 'ready';
    return `<a class="chp" href="${ready ? `#/read/${cls.id}/${ch.id}` : `#/class/${cls.id}`}">
      <span class="n">${i + 1}</span><span>${esc(ch.title)}</span></a>`;
  }).join('');
  return `
    <div class="tab-row">${tabs}</div>
    <div class="split">
      <div>
        <h3>${esc(f.heading)}</h3>
        <p class="tagline">${esc(f.tagline)}</p>
        <div class="check-list">${bullets}</div>
        <a class="c-btn c-btn--navy c-btn--lg" href="#/class/${cls.id}">Start ${esc(f.heading)} →</a>
      </div>
      <div class="chapters-panel">
        <h4>Chapters covered</h4>
        ${rows}
      </div>
    </div>`;
}

function viewHome() {
  const s = stats();
  const courseTabs = [['all', 'All courses'], ['class-10', 'Class 10'], ['class-11', 'Class 11'], ['class-12', 'Class 12']]
    .map(([k, l]) => `<button class="tab js-hometab ${homeCourseTab === k ? 'active' : ''}" data-tab="${k}">${l}</button>`).join('');

  const darkCards = PLATFORM_FEATURES.map(f => `<div class="dark-card">
    <div class="ic">${icon(f.icon, 22)}</div><h3>${esc(f.title)}</h3><p>${esc(f.desc)}</p>
  </div>`).join('');

  const teacherCards = TEACHERS.map(t => `<div class="teacher">
    <div class="av">${icon(t.emoji, 44)}</div><b>${esc(t.name)}</b><small>${esc(t.subject)}</small>
  </div>`).join('');

  const careerCards = CAREERS.map(c => `<div class="feature">
    <div class="ic">${icon(c.icon, 22)}</div><h3>${esc(c.title)}</h3><p>${esc(c.desc)}</p>
  </div>`).join('');

  const blogTeasers = POSTS.slice(0, 3).map(blogCard).join('');
  const sources = SOURCES.map(x => `<div>${esc(x)}</div>`).join('');

  return `
  <section class="mkt-hero"><div class="mkt-hero__in">
    <div>
      <div class="hero__badge">${icon('sparkle', 14)} CBSE 2025-26 SYLLABUS · 100% NCERT ALIGNED</div>
      <h1>Master CBSE Economics<br><em>Classes 10, 11 & 12</em></h1>
      <p class="sub">India's free learning platform for Economics — NCERT-exact lessons, chapter quizzes with instant feedback, <b>500 hands-on technical labs</b> and a full research-skills path. Always ₹0.</p>
      <div class="mkt-hero__cta">
        <a class="c-btn c-btn--primary c-btn--lg" href="#/courses">Start learning free →</a>
        <a class="c-btn c-btn--outline c-btn--lg" href="#/labs">${icon('play', 15)} Explore the labs</a>
      </div>
      <div class="mkt-hero__trust">
        <div><span class="tick">✓</span> 100% free, forever</div>
        <div><span class="tick">✓</span> No sign-up required</div>
        <div><span class="tick">✓</span> Works offline</div>
      </div>
    </div>
    <div class="mkt-hero__art">
      <div class="hero-card">
        <div class="hero-card__head">
          <div class="hero-card__id">
            <span class="hero-card__logo">₹</span>
            <span><b>National Income Accounting</b><small>Class 12 · Macro Economics</small></span>
          </div>
          <span class="hero-card__lesson">LESSON 4</span>
        </div>
        <div class="hero-card__formula">
          <div class="lbl">GDP at Market Price</div>
          <code>GDP<sub>MP</sub> = C + I + G + (X − M)
<span class="dim">where:</span>
C = Consumption
I = Investment
G = Government Spending
(X − M) = Net Exports</code>
        </div>
        <div class="hero-card__meta">
          <span>⏱ 45 min read</span>
          <span class="rate"><span class="star">★</span> <b>Free</b> · quiz included</span>
        </div>
        <a class="hero-card__btn" href="#/class/class-12">Continue learning →</a>
      </div>
      <div class="hero-float">${icon('star', 13)} 100% Free Forever</div>
    </div>
  </div></section>

  <section class="stats-band"><div class="stats-band__in">
    <p class="stats-band__label">Built for CBSE students across India — Classes 10, 11 & 12</p>
    <div class="stats-band__grid">
      <div><b>${s.chapters}</b><span>NCERT Chapters</span></div>
      <div><b>500+</b><span>Technical Labs</span></div>
      <div><b>${(s.questions + QBANK_TOTAL).toLocaleString('en-IN')}+</b><span>Practice Questions</span></div>
      <div><b>₹0</b><span>Cost, Forever</span></div>
    </div>
  </div></section>

  <section class="home-bp"><div class="home-bp__in">
    <div class="home-bp__copy">
      <div class="hero__badge">${icon('compass', 14)} NEW · INTERACTIVE SPECIAL</div>
      <h2>India's Economic Blueprint</h2>
      <p>From colonial stagnation to a $5-trillion trajectory — explore the 8-chapter architecture of the Indian economy on an interactive blueprint: a clickable India map, an animated reform pipeline and 3D infographic cards for every chapter of the IED syllabus.</p>
      <div class="home-bp__chips">
        ${BP_CHAPTERS.slice(0, 4).map(c => `<a class="chip" href="#/blueprint/${c.id}">${icon(c.icon, 14)} ${esc(c.short)}</a>`).join('')}
        <a class="chip chip--more" href="#/blueprint">+4 more</a>
      </div>
      <a class="c-btn c-btn--primary c-btn--lg" href="#/blueprint">Open the Blueprint ${icon('arrow', 15)}</a>
    </div>
    <a class="home-bp__map" href="#/blueprint" aria-label="Open India's Economic Blueprint">
      <svg viewBox="0 0 922 960" aria-hidden="true">
        <image href="assets/india-blueprint.jpg" x="0" y="0" width="922" height="960"/>
        ${BP_CHAPTERS.map(c => `<circle cx="${c.node.x}" cy="${c.node.y}" r="15" class="nd" style="--node:${c.color}"/>`).join('')}
      </svg>
    </a>
  </div></section>

  <section class="mkt-sec" id="home-courses">
    <div class="mkt-sec__head mkt-sec__head--center">
      <div><h2>Everything you need to master CBSE Economics</h2>
      <p>Micro foundations, macro analysis and Indian Economic Development — structured paths cover every NCERT chapter with notes, diagrams and quizzes.</p></div>
    </div>
    <div class="tab-row">${courseTabs}</div>
    <div class="course-grid js-homecourses">${homeCourseCards()}</div>
    <div style="text-align:center;margin-top:38px">
      <a class="c-btn c-btn--ghost" href="#/courses">Explore the full catalogue →</a>
    </div>
  </section>

  <section class="mkt-sec" id="home-certs">
    <div class="mkt-sec__head"><div><h2>Get Certified with ArthaRoshni</h2>
      <p>Four structured paths from Class 10 foundations to research-ready data skills. Finish the chapters, clear the quizzes — the path is free from start to finish.</p></div>
      <a class="c-btn c-btn--ghost" href="#/certifications">All certification paths →</a></div>
    <div class="cert-grid">${CERTS.map(certCard).join('')}</div>
  </section>

  <section style="background:var(--slate-50)"><div class="mkt-sec">
    <div class="mkt-sec__head mkt-sec__head--center">
      <div><h2>Structured Learning for Every Class</h2>
      <p>Choose your class and explore the complete CBSE Economics syllabus — chapter-wise, concept by concept.</p></div>
    </div>
    ${classFeaturesSection()}
  </div></section>


  <section class="dark-sec"><div class="dark-sec__in">
    <h2>Accelerate Your Learning with ArthaRoshni's Platform</h2>
    <p class="sub">Built for Indian students — with features that actually matter for CBSE success.</p>
    <div class="dark-grid">${darkCards}</div>
  </div></section>

  <section class="mkt-sec">
    <div class="mkt-sec__head"><div><h2>Six Expert-Built Learning Tracks</h2>
      <p>From board-exam strategy to code-first economics — every track is structured, visual and free.</p></div></div>
    <div class="teachers-grid">${teacherCards}</div>
  </section>

  <section style="background:var(--slate-50)"><div class="mkt-sec">
    <div class="mkt-sec__head"><div><h2>Where Economics Takes You</h2>
      <p>Economics isn't just a school subject — it's the foundation of top careers in policy, banking, data science and the civil services.</p></div></div>
    <div class="feature-grid">${careerCards}</div>
  </div></section>

  <section class="mkt-sec">
    <div class="mkt-sec__head mkt-sec__head--center">
      <div><h2>From the ArthaRoshni Blog</h2>
      <p>Revision plans, budget explainers and skill guides — written for CBSE Economics students.</p></div>
    </div>
    <div class="blog-grid">${blogTeasers}</div>
  </section>

  <section class="media-strip"><div class="media-strip__in">
    <p class="media-strip__label">Taught from trusted sources</p>
    <div class="media-strip__grid">${sources}</div>
  </div></section>

  <section class="cta-band"><div class="cta-band__in">
    <h2>Economics is changing fast.<br><em>Are you ready?</em></h2>
    <p>Join the students mastering CBSE Economics with ArthaRoshni — notes, quizzes and 500 technical labs, free for every student in India.</p>
    <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap">
      <a class="c-btn c-btn--primary c-btn--lg" href="#/courses">Start learning free →</a>
      <a class="c-btn c-btn--outline c-btn--lg" href="#/catalogue">See all 500 labs</a>
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
    href: `#/class/${c.id}`, color: su.color || c.color, icon: icon('courses', 40), tag: `Class ${c.grade}`,
    kick: c.title, title: su.title, desc: su.note || '', meta: `${su.chapters.length} chapters`,
  }))).join('');
  const TRACK_ICONS = { python: 'code', data: 'bars', stats: 'calc', behav: 'brain', nlp: 'chat',
    climate: 'leaf', intl: 'globe', capstone: 'gradcap', econ1: 'scatter', econ2: 'candles' };
  const trackCards = TRACK_META.map(t => {
    const n = CATALOGUE.filter(l => l.trackKey === t.key).length;
    return courseCard({ href: `#/catalogue`, color: t.color, icon: icon(TRACK_ICONS[t.key] || 'labs', 40), tag: 'Lab track',
      kick: 'Technical Lab', title: t.name, desc: `${n} hands-on labs to build and run for free.`, meta: `${n} labs` });
  }).join('');

  return `
  <section class="page-hero"><div class="page-hero__in">
    <div class="hero__badge">📚 All courses · always free</div>
    <h1>The full ArthaRoshni catalogue</h1>
    <p class="sub">Class courses, subject tracks and <b>500 technical labs</b> — every one free. Pick a class for notes & quizzes, or a lab track to build real research skills.</p>
    <div class="page-hero__cta">
      <a class="c-btn c-btn--primary" href="#/class/class-10">Class 10</a>
      <a class="c-btn c-btn--outline" href="#/class/class-11">Class 11</a>
      <a class="c-btn c-btn--outline" href="#/class/class-12">Class 12</a>
      <a class="c-btn c-btn--outline" href="#/catalogue">500 Labs</a>
    </div>
  </div></section>

  <section class="mkt-sec">
    <div class="mkt-sec__head"><div><h2>By class</h2><p>NCERT-aligned notes, infographics & quizzes for the full syllabus.</p></div></div>
    <div class="course-grid">${classCards}</div>
  </section>
  <section class="mkt-sec mkt-sec--tight">
    <div class="mkt-sec__head"><div><h2>By subject</h2><p>Jump straight into a paper — statistics, micro, macro or IED.</p></div></div>
    <div class="course-grid">${subjectCards}</div>
  </section>
  <section style="background:var(--slate-50)"><div class="mkt-sec">
    <div class="mkt-sec__head"><div><h2>Technical lab tracks</h2><p>10 tracks · 500 labs. From first Python steps to advanced econometrics.</p></div><a class="c-btn c-btn--ghost" href="#/catalogue">Open catalogue →</a></div>
    <div class="course-grid">${trackCards}</div>
  </div></section>

  <section class="cta-band"><div class="cta-band__in">
    <h2>Not sure where to start?</h2>
    <p>Pick your class — the notes, quizzes and key terms are laid out in textbook order, so you can simply start at chapter one.</p>
    <a class="c-btn c-btn--primary c-btn--lg" href="#/class/class-10">Start with Class 10 →</a>
  </div></section>`;
}

/* -------------------------------------------------- CERTIFICATIONS */
function viewCertifications() {
  const cards = CERTS.map(certCard).join('');
  const details = CERTS.map(c => `
    <div class="feature">
      <div class="ic ${c.grad}" style="color:#fff;font-family:var(--font-display);font-size:13px;font-weight:800;width:auto;padding:0 12px">${esc(c.code)}</div>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.subtitle)}</p>
      <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px">
        ${c.steps.map((s2, i) => `<div style="display:flex;gap:10px;align-items:flex-start;font-size:13.5px;color:var(--slate-600)">
          <span style="flex-shrink:0;width:22px;height:22px;border-radius:999px;background:var(--navy-100);color:var(--navy-700);display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:800">${i + 1}</span>
          <span>${esc(s2)}</span></div>`).join('')}
      </div>
      <a class="c-btn c-btn--navy" style="margin-top:18px" href="${c.href}">Start this path →</a>
    </div>`).join('');

  return `
  <section class="page-hero"><div class="page-hero__in">
    <div class="hero__badge">🏅 Certification paths · free from start to finish</div>
    <h1>Prove your Economics mastery</h1>
    <p class="sub">Four structured paths built from the real course content — finish the chapters and clear every quiz at <b>80%+</b> to complete a path. Your saved quiz scores are your progress record, tracked on your device.</p>
    <div class="page-hero__cta"><a class="c-btn c-btn--primary c-btn--lg" href="#/practice">Open the quiz bank</a></div>
  </div></section>

  <section class="mkt-sec">
    <div class="mkt-sec__head"><div><h2>Choose your path</h2><p>Each path maps to real chapters and quizzes inside the app — nothing extra to buy, ever.</p></div></div>
    <div class="cert-grid">${cards}</div>
  </section>

  <section style="background:var(--slate-50)"><div class="mkt-sec">
    <div class="mkt-sec__head"><div><h2>What each path takes</h2><p>The exact steps, so you always know how far you've come.</p></div></div>
    <div class="feature-grid" style="grid-template-columns:repeat(2,1fr)">${details}</div>
  </div></section>

  <section class="mkt-sec">
    <div class="mkt-sec__head mkt-sec__head--center"><div><h2>How it works</h2></div></div>
    <div class="steps-3">
      <div class="step-c"><div class="num">1</div><h3>Learn the chapters</h3><p>Read every chapter in your path — visual notes, key terms and diagrams in textbook order.</p></div>
      <div class="step-c"><div class="num">2</div><h3>Clear the quizzes</h3><p>Score 80% or higher in each chapter quiz. Your best scores are saved automatically on your device.</p></div>
      <div class="step-c"><div class="num">3</div><h3>Complete the path</h3><p>Finish every step and your scorecard is your proof of mastery. Downloadable certificates are coming soon.</p></div>
    </div>
  </section>

  <section class="cta-band"><div class="cta-band__in">
    <h2>One chapter is all it takes to start</h2>
    <p>Every path is free, self-paced and works offline. Begin with the class you're in today.</p>
    <a class="c-btn c-btn--primary c-btn--lg" href="#/courses">Browse courses →</a>
  </div></section>`;
}

/* -------------------------------------------------- CERT detail page */
function viewCert([id]) {
  const c = CERTS.find(x => x.id === id);
  if (!c) return notFound();
  const clsId = { 'ace-10': 'class-10', 'ace-11': 'class-11', 'ace-12': 'class-12' }[c.id];
  const cls = clsId ? byClass[clsId] : null;
  const chapters = cls ? cls.subjects.flatMap(su => su.chapters) : [];
  const chaptersHtml = cls ? `
    <section class="mkt-sec mkt-sec--tight">
      <div class="mkt-sec__head"><div><h2>Chapters in this path</h2>
        <p>Finish each one, then clear its quiz at 80%+ to keep the path on track.</p></div></div>
      <div class="chapters-panel" style="max-width:760px">
        ${chapters.map((ch, i) => `<a class="chp" href="${ch.status === 'ready' ? `#/read/${cls.id}/${ch.id}` : `#/class/${cls.id}`}">
          <span class="n">${i + 1}</span><span>${esc(ch.title)}</span></a>`).join('')}
      </div>
    </section>` : `
    <section class="mkt-sec mkt-sec--tight">
      <div class="mkt-sec__head"><div><h2>Built on the 500-lab catalogue</h2>
        <p>Pick labs across Python, data and econometrics tracks — then close with a capstone.</p></div></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <a class="c-btn c-btn--navy" href="#/catalogue">Open the 500-lab catalogue ${icon('arrow', 14)}</a>
        <a class="c-btn c-btn--ghost" href="#/labs">Try the interactive labs</a>
      </div>
    </section>`;

  return `
  <section class="page-hero"><div class="page-hero__in">
    <div class="hero__badge">${icon('certifications', 14)} CERTIFICATE PATH · ${esc(c.code)} · FREE</div>
    <h1>${esc(c.title)}</h1>
    <p class="sub">${esc(c.subtitle)}</p>
    <div class="page-hero__cta">
      <a class="c-btn c-btn--primary c-btn--lg" href="${c.href}">Start this path ${icon('arrow', 15)}</a>
      <a class="c-btn c-btn--outline c-btn--lg" href="#/certifications">All paths</a>
    </div>
  </div></section>

  <section class="mkt-sec">
    <div class="mkt-sec__head"><div><h2>The exact steps</h2>
      <p>Your saved quiz scores are the progress record — tracked on your device, no account needed.</p></div></div>
    <div class="steps-3">
      ${c.steps.map((s, i) => `<div class="step-c"><div class="num">${i + 1}</div>
        <h3>Step ${i + 1}</h3><p>${esc(s)}</p></div>`).join('')}
    </div>
    <div class="cert-card__tags" style="margin-top:22px">${c.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
  </section>

  ${chaptersHtml}

  <section class="cta-band"><div class="cta-band__in">
    <h2>Free from start to finish</h2>
    <p>No fees and nothing to unlock — complete the steps and your scorecard is your proof of mastery. Downloadable certificates are coming soon.</p>
    <a class="c-btn c-btn--primary c-btn--lg" href="${c.href}">Begin ${esc(c.code)} now →</a>
  </div></section>`;
}

/* -------------------------------------------------- BLOGS */
function viewBlogs() {
  const [featured, ...rest] = POSTS;
  const featuredHtml = `<a class="blog-featured" href="#/blog/${featured.id}">
    <div class="blog-featured__art ${featured.grad}">${featured.icon}</div>
    <div class="blog-featured__body">
      <div class="kick">Featured · ${esc(featured.kicker)}</div>
      <h2>${esc(featured.title)}</h2>
      <p>${esc(featured.excerpt)}</p>
      <div class="blog-meta"><span>${esc(featured.date)}</span><span>·</span><span>${featured.mins} min read</span><span>·</span><span style="color:var(--amber-600);font-weight:700">Read article →</span></div>
    </div>
  </a>`;

  return `
  <section class="page-hero"><div class="page-hero__in">
    <div class="hero__badge">📰 The ArthaRoshni Blog</div>
    <h1>Study smarter, score higher</h1>
    <p class="sub">Revision plans, budget explainers, numerical-mistake fixes and skill guides — original articles written for CBSE Economics students.</p>
  </div></section>

  <section class="mkt-sec">
    ${featuredHtml}
    <div class="blog-grid">${rest.map(blogCard).join('')}</div>
  </section>

  <section class="cta-band"><div class="cta-band__in">
    <h2>Ready to put it into practice?</h2>
    <p>Reading about revision is step one. The notes, quizzes and labs are step two — and they're all free.</p>
    <a class="c-btn c-btn--primary c-btn--lg" href="#/courses">Open the courses →</a>
  </div></section>`;
}

function renderPostBlocks(body) {
  return body.map(b => {
    if (b.type === 'h2') return `<h2>${esc(b.text)}</h2>`;
    if (b.type === 'ul') return `<ul>${b.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    if (b.type === 'tip') return `<div class="post-tip">💡 ${b.text}</div>`;
    return `<p>${b.text}</p>`;
  }).join('');
}

function viewBlogPost([id]) {
  const p = postById(id);
  if (!p) return notFound();
  const related = POSTS.filter(x => x.id !== id).slice(0, 3).map(blogCard).join('');
  return `
  <article class="post">
    <div class="kick">${esc(p.kicker)}</div>
    <h1>${esc(p.title)}</h1>
    <div class="post-meta"><span>✍️ ArthaRoshni · by Roshani</span><span>${esc(p.date)}</span><span>${p.mins} min read</span></div>
    ${renderPostBlocks(p.body)}
    <div style="margin-top:36px;display:flex;gap:12px;flex-wrap:wrap">
      <a class="c-btn c-btn--navy" href="#/blogs">← All articles</a>
      <a class="c-btn c-btn--ghost" href="#/courses">Open the courses</a>
    </div>
  </article>
  <section class="mkt-sec mkt-sec--tight" style="padding-top:44px">
    <div class="mkt-sec__head"><div><h2>Keep reading</h2></div></div>
    <div class="blog-grid">${related}</div>
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
      <div class="feature"><div class="ic">${icon('phone', 22)}</div><h3>Any device</h3><p>Works on a basic phone, offline, installable to your home screen.</p></div>
      <div class="feature"><div class="ic">${icon('heart', 22)}</div><h3>No coaching needed</h3><p>Self-paced, clearly explained, and free of cost.</p></div>
      <div class="feature"><div class="ic">${icon('labs', 22)}</div><h3>Future-ready</h3><p>Learn Python, data & AI skills that universities and employers value.</p></div>
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

// Course chapter → question-bank chapter, so chapter quizzes include the
// full 100-question bank (options built from authentic answers via mcq.js).
const QUIZ_QBANK_MAP = {
  'c10-ch1': ['x', 'q1'], 'c10-ch2': ['x', 'q2'], 'c10-ch3': ['x', 'q3'],
  'c10-ch4': ['x', 'q4'], 'c10-ch5': ['x', 'q5'],
  'c11-ied-ch1': ['xi', 'q6'], 'c11-ied-ch2': ['xi', 'q7'], 'c11-ied-ch3': ['xi', 'q8'],
  'c11-ied-ch4': ['xi', 'q9'], 'c11-ied-ch5': ['xi', 'q11'], 'c11-ied-ch6': ['xi', 'q12'],
  'c11-ied-ch7': ['xi', 'q13'], 'c11-ied-ch8': ['xi', 'q14'],
  'c12-mic-ch1': ['xii-micro', 'q22'], 'c12-mac-ch2': ['xii-macro', 'q17'],
};
const quizQsCache = {};
function quizQuestions(ch) {
  if (quizQsCache[ch.id]) return quizQsCache[ch.id];
  const base = (ch.questions || []).filter(q => q.type !== 'subjective');
  const map = QUIZ_QBANK_MAP[ch.id];
  let extra = [];
  if (map) {
    const g = QBANK.groups.find(x => x.id === map[0]);
    const qc = g && g.chapters.find(x => x.id === map[1]);
    if (qc) extra = qc.questions.map(({ q, a }) => {
      const o = buildOptions(map[0], map[1], q, a);
      return { q, options: o.list, answer: o.answer, explain: a, marks: 1, source: 'qbank' };
    });
  }
  return (quizQsCache[ch.id] = base.concat(extra));
}

function viewQuiz([classId, chapterId]) {
  const found = findChapter(classId, chapterId);
  if (!found) return notFound();
  const { cls, ch } = found;
  const qs = quizQuestions(ch);
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

/* -------------------------------------------------- ACCOUNT */
function viewAccount() {
  if (!Auth.isAuthed()) { try { sessionStorage.setItem('ar.returnTo', '#/account'); } catch {} return viewLocked('#/account', 'your account'); }
  const p = Auth.profile() || {};
  const u = Auth.user() || {};
  const TYPE = { student: 'Student', teacher: 'Teacher', professional: 'Working professional', other: 'Other' };
  const row = (k, v) => `<div class="acct-row"><span>${esc(k)}</span><b>${esc(v || '—')}</b></div>`;
  return topbar('Your account', Auth.displayName(), { back: '#/' }) + `
  <main class="page">
    <div class="acct-card">
      <h2>Profile</h2>
      ${row('Name', p.full_name)}
      ${row('Role', TYPE[p.user_type] || '—')}
      ${row('Email', p.email || u.email)}
      ${row('Phone', p.phone)}
      ${row('School / organisation', p.organisation)}
      <div class="acct-actions">
        <a class="c-btn c-btn--primary" href="#/labs">Open the labs →</a>
        <button class="c-btn c-btn--outline js-signout" type="button">Sign out</button>
      </div>
    </div>
  </main>`;
}

/* -------------------------------------------------- PRACTICE hub */
function qbBestLabel(groupId, chId) {
  const sc = Store.score('qb:' + groupId + '/' + chId);
  return sc ? `<span class="tag tag--ready">Best ${sc.best}/${sc.total}</span>` : '';
}

function viewPractice() {
  // Class + chapter-wise authentic question bank (Bihar Board / CBSE, Classes X-XII)
  const groupSections = QBANK.groups.map(g => {
    const gc = gradeColor(g.grade);
    const rows = g.chapters.map(ch => `
      <a class="chapter-row" href="#/qbank/${g.id}/${ch.id}">
        <div class="chapter-row__num" style="background:${gc}22;color:${gc}">${ch.num}</div>
        <div class="chapter-row__body">
          <h4>${esc(ch.title)}</h4>
          <p><span>${ch.count} questions</span> ${qbBestLabel(g.id, ch.id)}</p>
        </div>
        <div class="chapter-row__chev">›</div>
      </a>`).join('');
    const gtotal = g.chapters.reduce((s, c) => s + c.count, 0);
    return `
      <div class="section-title" style="color:${gc}">
        <span>${esc(g.title)}</span>
        <span style="margin-left:auto;font-weight:700;color:var(--ink-faint)">${g.chapters.length} chapters · ${gtotal} Q</span>
      </div>
      ${rows}`;
  }).join('');

  // Keep the original instant-feedback MCQ quizzes (curriculum-linked, seeded)
  const ready = allReadyChapters();
  const mcqCards = ready.map(({ cls, ch }) => {
    const sc = Store.score(ch.id);
    return `<a class="chapter-row" href="#/quiz/${cls.id}/${ch.id}">
      <div class="chapter-row__num" style="background:${gradeColor(cls.grade)}22;color:${gradeColor(cls.grade)}">${cls.grade}</div>
      <div class="chapter-row__body">
        <h4>${esc(ch.title)}</h4>
        <p><span>${(ch.questions || []).filter(q => q.type !== 'subjective').length} MCQs</span>
          ${sc ? `<span class="tag tag--ready">Best ${sc.best}/${sc.total}</span>` : ''}</p>
      </div>
      <div class="chapter-row__chev">›</div>
    </a>`;
  }).join('');

  return `
  <section class="page-hero"><div class="page-hero__in">
    <div class="hero__badge">📝 Practice · chapter-wise question bank</div>
    <h1>Practice until it sticks</h1>
    <p class="sub">${QBANK_TOTAL.toLocaleString()}+ authentic questions across Classes X, XI & XII — organised chapter by chapter. Tap any chapter to open its own quiz page: take it as an <b>MCQ quiz</b> with instant feedback, or flip through <b>flashcards</b>. Everything saves on your device, works offline, stays free.</p>
  </div></section>
  <main class="page">
    <div class="callout callout--exam"><div class="callout__label">🎯 About this bank</div>
      <p>These ${QBANK_TOTAL.toLocaleString()} Q&amp;A are drawn from the Bihar Economics question bank, mapped to every NCERT chapter. Each chapter opens on its <b>own page</b> in two modes: <b>MCQ</b> — the wrong options are pooled from other real answers in the bank (nothing invented) — or <b>flashcards</b>, where you reveal the answer and grade yourself.</p></div>
    ${groupSections}
    <div class="divider" style="margin-top:26px"></div>
    <div class="section-title">🧩 Instant-feedback MCQ quizzes</div>
    <p class="muted" style="margin:0 4px 12px;font-size:13.5px">Multiple-choice quizzes with auto-scoring for the fully-written chapters.</p>
    ${mcqCards || '<p class="muted" style="margin:0 4px">Coming soon.</p>'}
  </main>`;
}

/* -------------------------------------------------- QBANK · chapter flashcard quiz */
const qbankState = {};
function qbKey(groupId, chapterId) { return groupId + '/' + chapterId; }
function qbFresh(n, shuffle, mode) {
  const order = Array.from({ length: n }, (_, i) => i);
  if (shuffle) for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  return { mode: mode || 'mcq', order, i: 0, known: 0, correct: 0, revealed: false, answered: false, picked: null, opts: null, done: false, shuffled: !!shuffle };
}

function viewQBank(params) {
  const [groupId, chapterId] = params;
  const found = qbFind(groupId, chapterId);
  if (!found) return notFound();
  const { group, chapter } = found;
  const qs = chapter.questions;
  const key = qbKey(groupId, chapterId);
  const gc = gradeColor(group.grade);

  if (!qbankState[key]) qbankState[key] = qbFresh(qs.length, false, 'mcq');
  const st = qbankState[key];
  const back = topbar(chapter.title, group.title, { back: '#/practice' });

  const modeBar = `<div class="qb-modes">
    <button class="qb-mode ${st.mode === 'mcq' ? 'active' : ''} js-qb-mode" data-key="${key}" data-mode="mcq">🅰 MCQ quiz</button>
    <button class="qb-mode ${st.mode === 'cards' ? 'active' : ''} js-qb-mode" data-key="${key}" data-mode="cards">🃏 Flashcards</button>
  </div>`;

  let body;
  if (st.done) {
    const total = st.order.length;
    const got = st.mode === 'mcq' ? st.correct : st.known;
    const pctVal = total ? Math.round((got / total) * 100) : 0;
    Store.saveScore('qb:' + key, got, total);
    const r = 54, circ = 2 * Math.PI * r, off = circ * (1 - pctVal / 100);
    body = `<div class="scorecard">
      <svg class="ring" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r="${r}" fill="none" stroke="var(--line)" stroke-width="12"/>
        <circle cx="65" cy="65" r="${r}" fill="none" stroke="${pctVal >= 60 ? 'var(--ok)' : 'var(--danger)'}" stroke-width="12"
          stroke-linecap="round" stroke-dasharray="${circ}" stroke-dashoffset="${off}" transform="rotate(-90 65 65)"/>
        <text x="65" y="72" text-anchor="middle" font-size="28" font-weight="800" fill="var(--ink)">${pctVal}%</text>
      </svg>
      <h2>${got} / ${total} ${st.mode === 'mcq' ? 'correct' : 'knew it'}</h2>
      <p class="muted">${pctVal >= 80 ? 'Excellent! 🎉' : pctVal >= 60 ? 'Solid — revise the ones you missed.' : 'Keep drilling — reread the chapter and retry.'}</p>
      <div class="btn-row">
        <button class="btn js-qb-retry" data-key="${key}">🔁 Retry</button>
        <button class="btn btn--ghost js-qb-shuffle" data-key="${key}" data-n="${qs.length}">🔀 Shuffle &amp; retry</button>
      </div>
      <a class="btn btn--ghost" href="#/practice" style="margin-top:10px">← All chapters</a>
    </div>`;
  } else if (st.mode === 'mcq') {
    const total = st.order.length;
    const qi = st.order[st.i];
    const q = qs[qi];
    if (!st.opts) st.opts = buildOptions(groupId, chapterId, q.q, q.a);
    const opts = st.opts.list.map((o, idx) => {
      let cls2 = '';
      if (st.answered) { if (idx === st.opts.answer) cls2 = 'correct'; else if (idx === st.picked) cls2 = 'wrong'; }
      return `<button class="quiz-opt ${cls2} js-qbm-opt" data-key="${key}" data-idx="${idx}" ${st.answered ? 'disabled' : ''}>
        <span class="key">${String.fromCharCode(65 + idx)}</span><span>${esc(o)}</span></button>`;
    }).join('');
    body = `${modeBar}
      <div class="quiz-progress">
        <div class="pbar"><i style="width:${(st.i / total) * 100}%;background:${gc}"></i></div>
        <span class="quiz-count">${st.i + 1}/${total}</span>
      </div>
      <div class="block"><p style="font-weight:700;font-size:17px">${esc(q.q)}</p></div>
      <div class="quiz-opts">${opts}</div>
      ${st.answered
        ? `<div class="explain"><b>Answer:</b> ${String.fromCharCode(65 + st.opts.answer)}. ${esc(q.a)}</div>
           <button class="btn mt js-qbm-next" data-key="${key}">${st.i + 1 < total ? 'Next question →' : 'See results →'}</button>`
        : `<p class="qb-note">Wrong options are real answers from elsewhere in this bank — pick the one that fits this question.</p>`}`;
  } else {
    const total = st.order.length;
    const qi = st.order[st.i];
    const q = qs[qi];
    body = `${modeBar}
      <div class="quiz-progress">
        <div class="pbar"><i style="width:${(st.i / total) * 100}%;background:${gc}"></i></div>
        <span class="quiz-count">${st.i + 1}/${total}</span>
      </div>
      <div class="qb-card">
        <div class="qb-card__tag" style="color:${gc}">Q${st.i + 1} · ${esc(chapter.title)}</div>
        <p class="qb-card__q">${esc(q.q)}</p>
        ${st.revealed
          ? `<div class="qb-card__a"><span class="qb-card__alabel">Answer</span>${esc(q.a)}</div>
             <div class="qb-grade-row">
               <button class="btn btn--ghost js-qb-grade" data-key="${key}" data-known="0">↻ Review again</button>
               <button class="btn js-qb-grade" data-key="${key}" data-known="1">✓ I knew it</button>
             </div>`
          : `<button class="btn js-qb-reveal" data-key="${key}">Reveal answer</button>`}
      </div>`;
  }

  return back + `<main class="page">${body}</main>`;
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
    <div class="search-box">${icon('search', 18)} <input id="q" type="search" placeholder="Try “per capita income”, “GDP”, “MNC”…" autocomplete="off"></div>
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
      <div class="chapter-row"><div class="chapter-row__num">❓</div><div class="chapter-row__body"><h4>${(s.questions + QBANK_TOTAL).toLocaleString('en-IN')}+ questions</h4><p><span>Chapter-wise practice bank + PYQ import slot</span></p></div></div>
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

  // Mobile menu accordions
  document.querySelectorAll('.js-mmgroup').forEach(b => b.addEventListener('click', () => {
    const g = b.closest('.mm-group');
    const wasOpen = g.classList.contains('open');
    document.querySelectorAll('.mm-group.open').forEach(x => x.classList.remove('open'));
    if (!wasOpen) g.classList.add('open');
  }));

  // Desktop dropdowns — keyboard/touch toggle (hover handled in CSS)
  document.querySelectorAll('.nav-item > .nav-link').forEach(a => {
    a.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); a.parentElement.querySelector('.nav-drop a')?.focus(); }
    });
  });

  // Sticky nav shadow on scroll
  const nav = document.querySelector('.js-sitenav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);

  // Homepage course tabs (All / Class 10 / 11 / 12)
  document.querySelectorAll('.js-hometab').forEach(b => b.addEventListener('click', () => {
    homeCourseTab = b.dataset.tab;
    document.querySelectorAll('.js-hometab').forEach(x => x.classList.toggle('active', x === b));
    const grid = document.querySelector('.js-homecourses');
    if (grid) grid.innerHTML = homeCourseCards();
  }));

  // Homepage class-features tabs (re-render the section only)
  document.querySelectorAll('.js-classtab').forEach(b => b.addEventListener('click', () => {
    homeClassTab = b.dataset.cls;
    const sec = b.closest('.mkt-sec');
    if (sec) {
      const head = sec.querySelector('.mkt-sec__head');
      sec.innerHTML = (head ? head.outerHTML : '') + classFeaturesSection();
      wire();
    }
  }));

  // Navbar + home search -> go to search page with query
  const goSearch = val => { location.hash = '#/search'; setTimeout(() => { const q = document.getElementById('q'); if (q) { q.value = val; q.dispatchEvent(new Event('input')); } }, 0); };
  document.querySelectorAll('.js-navsearch').forEach(ns =>
    ns.addEventListener('submit', e => { e.preventDefault(); goSearch(ns.querySelector('input').value); }));
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

  // Account forms (sign up / in / verify / reset / sign out)
  wireAuth(render);

  // Quiz option click
  document.querySelectorAll('.quiz-opt:not([disabled])').forEach(o => o.addEventListener('click', () => {
    const { name, params } = parseHash();
    if (name !== 'quiz') return;
    const found = findChapter(params[0], params[1]);
    const st = quizState[found.ch.id];
    const qs = quizQuestions(found.ch);
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
    delete quizQsCache[b.dataset.ch]; // regenerate MCQ options fresh on retry
    render();
  }));

  // QBank quiz — mode toggle (MCQ / flashcards)
  document.querySelectorAll('.js-qb-mode').forEach(b => b.addEventListener('click', () => {
    const st = qbankState[b.dataset.key];
    if (st && st.mode === b.dataset.mode) return;
    qbankState[b.dataset.key] = qbFresh(st.order.length, st.shuffled, b.dataset.mode);
    render();
  }));

  // QBank MCQ mode
  document.querySelectorAll('.js-qbm-opt:not([disabled])').forEach(o => o.addEventListener('click', () => {
    const st = qbankState[o.dataset.key]; if (!st || st.answered) return;
    st.picked = +o.dataset.idx; st.answered = true;
    if (st.picked === st.opts.answer) st.correct++;
    render();
  }));
  document.querySelectorAll('.js-qbm-next').forEach(b => b.addEventListener('click', () => {
    const st = qbankState[b.dataset.key]; if (!st) return;
    st.answered = false; st.picked = null; st.opts = null; st.i++;
    if (st.i >= st.order.length) st.done = true;
    render();
  }));

  // QBank flashcard mode
  document.querySelectorAll('.js-qb-reveal').forEach(b => b.addEventListener('click', () => {
    const st = qbankState[b.dataset.key]; if (!st) return;
    st.revealed = true; render();
  }));
  document.querySelectorAll('.js-qb-grade').forEach(b => b.addEventListener('click', () => {
    const st = qbankState[b.dataset.key]; if (!st) return;
    if (b.dataset.known === '1') st.known++;
    st.revealed = false; st.i++;
    if (st.i >= st.order.length) st.done = true;
    render();
  }));
  document.querySelectorAll('.js-qb-retry').forEach(b => b.addEventListener('click', () => {
    const st = qbankState[b.dataset.key];
    qbankState[b.dataset.key] = qbFresh(st ? st.order.length : +b.dataset.n, st ? st.shuffled : false, st ? st.mode : 'mcq');
    render();
  }));
  document.querySelectorAll('.js-qb-shuffle').forEach(b => b.addEventListener('click', () => {
    const st = qbankState[b.dataset.key];
    qbankState[b.dataset.key] = qbFresh(+b.dataset.n, true, st ? st.mode : 'mcq');
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

/* -------------------------------------------------- catalogue download gate */
const CATALOGUE_PDF = 'ArthaRoshni-500-Labs-Catalogue.pdf';

function openDownloadGate() {
  // Labs are gated, so a visitor reaching this is already signed in — but guard anyway.
  if (!Auth.isAuthed()) { try { sessionStorage.setItem('ar.returnTo', '#/catalogue'); } catch {} location.hash = '#/login'; return; }
  const p = Auth.profile() || {};
  const back = document.createElement('div');
  back.className = 'dl-backdrop';
  back.innerHTML = `
    <div class="dl-modal" role="dialog" aria-modal="true" aria-labelledby="dl-h">
      <h2 id="dl-h">Download the 500-lab catalogue</h2>
      <p class="dl-sub">Confirm your details and tell us how you'll use it. We record each download to keep the catalogue free and improve it.</p>
      <form class="auth-form js-dlform" novalidate>
        <label class="auth-f">Name <span class="req">*</span>
          <input name="name" type="text" required value="${esc(p.full_name || '')}" placeholder="Your name">
        </label>
        <label class="auth-f">Email <span class="req">*</span>
          <input name="email" type="email" required value="${esc(p.email || Auth.user()?.email || '')}" placeholder="you@example.com">
        </label>
        <label class="auth-f">How will you use the catalogue? <span class="req">*</span>
          <textarea name="purpose" rows="3" required placeholder="e.g. Planning a Class 12 economics project on inflation."></textarea>
        </label>
        <div class="auth-msg js-msg" hidden></div>
        <div class="dl-actions">
          <button type="button" class="dl-cancel js-dl-cancel">Cancel</button>
          <button type="submit" class="c-btn c-btn--primary js-dl-submit">Download PDF ⬇️</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(back);
  document.body.style.overflow = 'hidden';

  const close = () => { back.remove(); document.body.style.overflow = ''; };
  back.addEventListener('click', e => { if (e.target === back) close(); });
  back.querySelector('.js-dl-cancel').addEventListener('click', close);
  document.addEventListener('keydown', function onEsc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onEsc); } });

  back.querySelector('.js-dlform').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = (fd.get('name') || '').trim();
    const email = (fd.get('email') || '').trim();
    const purpose = (fd.get('purpose') || '').trim();
    const msg = back.querySelector('.js-msg');
    const showErr = t => { msg.hidden = false; msg.className = 'auth-msg js-msg auth-msg--err'; msg.textContent = t; };
    if (!name || !email || purpose.length < 5) return showErr('Please fill in your name, email and a brief purpose.');

    const btn = back.querySelector('.js-dl-submit');
    btn.disabled = true; btn.textContent = 'Saving…';
    try {
      const sb = await getSupabase();
      if (sb) {
        await sb.from('lab_downloads').insert({
          user_id: Auth.user()?.id, name, email, purpose, organisation: p.organisation || null,
        });
      }
    } catch { /* recording is best-effort; never block the learner's download */ }

    // Trigger the download, then close.
    const a = document.createElement('a');
    a.href = CATALOGUE_PDF; a.download = CATALOGUE_PDF; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    close();
  });
}
setDownloadHandler(openDownloadGate);

/* -------------------------------------------------- boot */
// Resolve the session before the first paint, otherwise a signed-in user would
// see the locked screen flash on a lab route before the session resolves.
Auth.init(render).then(() => {
  render();
  // After first paint, pull any admin edits / uploaded media from the cloud
  // (no-op when offline or not configured), then repaint.
  syncFromCloud(() => render());
});
