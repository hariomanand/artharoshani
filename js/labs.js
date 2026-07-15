// Technical Economics Labs — views + interactive in-browser tools.
// All tools run client-side (zero backend, zero cost).
import { LABS, labById } from '../data/labs.js';
import { CATALOGUE, TRACK_META } from '../data/catalogue.js';
import { icon } from './icons.js';

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TRACK_ICONS = { python: 'code', data: 'bars', stats: 'calc', behav: 'brain', nlp: 'chat',
  climate: 'leaf', intl: 'globe', capstone: 'gradcap', econ1: 'scatter', econ2: 'candles' };
const tIcon = (key, size = 14) => icon(TRACK_ICONS[key] || 'labs', size);

/* ============================== HUB ============================== */
export function renderLabsHub() {
  const cards = LABS.map(l => `
    <a class="lab-card" href="#/lab/${l.id}">
      <div class="lab-card__icon" style="background:${l.color}1a;color:${l.color}">${icon(l.icon, 26)}</div>
      <div class="lab-card__body">
        <h3>${esc(l.title)}</h3>
        <p>${esc(l.tagline)}</p>
        <div class="lab-card__meta">
          <span class="chip">${esc(l.level)}</span>
          ${l.tool ? '<span class="chip chip--live">▶ Interactive</span>' : '<span class="chip">Guide</span>'}
        </div>
      </div>
    </a>`).join('');

  return `<main class="page">
    <div class="hero" style="background:radial-gradient(120% 140% at 0% 0%, #7c3aed, #1e3a8a 55%, #0d9488)">
      <div class="hero__glow">🔬</div>
      <div class="hero__badge">🎓 University-style facilities</div>
      <h1>Technical<br>Economics Labs</h1>
      <p>Hands-on labs modelled on real university facilities — econometrics, Python, sentiment analysis, behavioral experiments and more. Click, run and learn.</p>
    </div>
    <a class="lab-card" href="#/catalogue" style="border-color:var(--primary)">
      <div class="lab-card__icon" style="background:var(--primary-soft);color:var(--primary)">${icon('grid', 26)}</div>
      <div class="lab-card__body">
        <h3>Full Lab Catalogue — 500 labs</h3>
        <p>Every skill area, class 10 → college. Searchable & filterable.</p>
        <div class="lab-card__meta"><span class="chip chip--live">${CATALOGUE.length} labs</span><span class="chip">${TRACK_META.length} tracks</span></div>
      </div>
      <div class="lab-card__chev">›</div>
    </a>

    <div class="section-title">🧪 Interactive labs (run in-browser)</div>
    <div class="lab-grid">${cards}</div>
  </main>`;
}

/* ============================== 500-LAB CATALOGUE ============================== */
const catState = { q: '', track: 'all', level: 'all', page: 1 };
const CAT_PER_PAGE = 10;

export function renderCatalogue() {
  const trackChips = ['all', ...TRACK_META.map(t => t.key)].map(k => {
    const meta = TRACK_META.find(t => t.key === k);
    const label = k === 'all' ? 'All tracks' : `${tIcon(k, 13)} ${meta.name.split(' ')[0]}`;
    return `<button class="fchip ${catState.track === k ? 'active' : ''}" data-f="track" data-v="${k}">${label}</button>`;
  }).join('');
  const levelChips = ['all', 'Beginner', 'Intermediate', 'Advanced'].map(l =>
    `<button class="fchip ${catState.level === l ? 'active' : ''}" data-f="level" data-v="${l}">${l === 'all' ? 'All levels' : l}</button>`).join('');

  return `<main class="page">
    <div class="reader-head">
      <div class="kicker" style="color:var(--primary)">📚 Master Catalogue</div>
      <h1>500 Economics Labs</h1>
      <p class="lead">A full, free curriculum of hands-on labs — from first Python steps to advanced econometrics, NLP, behavioral experiments, climate & development economics.</p>
    </div>
    <div class="search-box">🔎 <input id="cat-q" type="search" placeholder="Search 500 labs — “regression”, “sentiment”, “Gini”…" value="${esc(catState.q)}" autocomplete="off"></div>
    <div class="fchip-row" data-group="track">${trackChips}</div>
    <div class="fchip-row" data-group="level">${levelChips}</div>
    <div id="cat-list"></div>
  </main>`;
}

function filteredCatalogue() {
  const q = catState.q.trim().toLowerCase();
  return CATALOGUE.filter(l =>
    (catState.track === 'all' || l.trackKey === catState.track) &&
    (catState.level === 'all' || l.difficulty === catState.level) &&
    (!q || (l.title + l.subtopic + l.skills + l.track).toLowerCase().includes(q)));
}

function renderCatalogueList() {
  const box = document.getElementById('cat-list');
  if (!box) return;
  const rows = filteredCatalogue();
  const pageCount = Math.max(1, Math.ceil(rows.length / CAT_PER_PAGE));
  if (catState.page > pageCount) catState.page = pageCount;
  if (catState.page < 1) catState.page = 1;
  const start = (catState.page - 1) * CAT_PER_PAGE;
  const pageRows = rows.slice(start, start + CAT_PER_PAGE);

  if (!rows.length) {
    box.innerHTML = `<div class="empty"><div class="ico">🔍</div><h3>No labs match</h3><p>Try a different keyword or filter.</p></div>`;
    return;
  }

  const list = pageRows.map(l => `<a class="cat-row" href="#/lab-item/${l.id}">
    <div class="cat-row__id" style="background:${l.color}1a;color:${l.color}">${l.id}</div>
    <div class="cat-row__body">
      <h4>${esc(l.title)}</h4>
      <p><span class="chip">${tIcon(l.trackKey, 12)} ${esc(l.subtopic)}</span> <span class="chip">${esc(l.level)}</span> <span class="chip chip--diff-${l.difficulty.toLowerCase()}">${l.difficulty}</span></p>
    </div><div class="chapter-row__chev">›</div></a>`).join('');

  const from = start + 1, to = start + pageRows.length;
  box.innerHTML = `<div class="cat-count">Showing ${from}–${to} of ${rows.length} labs · page ${catState.page} of ${pageCount}</div>`
    + list + pager(pageCount);
}

// Compact pager: first · prev · a window of numbers · next · last.
function pager(pageCount) {
  if (pageCount <= 1) return '';
  const cur = catState.page;
  const btn = (label, page, opts = {}) => {
    if (opts.gap) return `<button class="cat-pager__gap" disabled>…</button>`;
    const cls = opts.current ? ' is-current' : '';
    const dis = opts.disabled ? ' disabled' : '';
    return `<button class="js-cat-page${cls}" data-page="${page}"${dis} aria-label="${opts.aria || 'Page ' + label}"${opts.current ? ' aria-current="page"' : ''}>${label}</button>`;
  };
  const nums = [];
  const win = 2;
  let lo = Math.max(1, cur - win), hi = Math.min(pageCount, cur + win);
  if (lo > 1) { nums.push(btn('1', 1)); if (lo > 2) nums.push(btn('', 0, { gap: true })); }
  for (let p = lo; p <= hi; p++) nums.push(btn(String(p), p, { current: p === cur }));
  if (hi < pageCount) { if (hi < pageCount - 1) nums.push(btn('', 0, { gap: true })); nums.push(btn(String(pageCount), pageCount)); }
  return `<div class="cat-pager">
    ${btn('‹', cur - 1, { disabled: cur === 1, aria: 'Previous page' })}
    ${nums.join('')}
    ${btn('›', cur + 1, { disabled: cur === pageCount, aria: 'Next page' })}
  </div>`;
}

export function renderCatalogueLab(id) {
  const l = CATALOGUE.find(x => x.id === id);
  if (!l) return `<main class="page"><div class="empty"><div class="ico">📚</div><h3>Lab not found</h3></div></main>`;
  const steps = l.steps.map((s, i) => `<div class="flow__step"><div class="flow__rail"><div class="flow__node" style="background:${l.color};box-shadow:0 0 0 4px ${l.color}22">${i + 1}</div>${i < l.steps.length - 1 ? `<div class="flow__line" style="background:linear-gradient(${l.color}, ${l.color}55)"></div>` : ''}</div><div class="flow__card"><p>${esc(s)}</p></div></div>`).join('');
  const spec = [['🎯 Objective', l.output], ['🧠 Skills', l.skills], ['📊 Data source', l.data], ['🛠️ Tools', l.tools], ['📈 Level', l.level], ['⏱️ Time', l.minutes + ' min'], ['✅ Assessment', l.assessment], ['🏷️ Difficulty', l.difficulty]];
  return `<main class="page">
    <div class="reader-head">
      <div class="kicker" style="color:${l.color}">Lab ${l.id} · ${tIcon(l.trackKey, 14)} ${esc(l.track)}</div>
      <h1>${esc(l.title)}</h1>
      <p class="lead">${esc(l.subtopic)} — build this lab as a free Colab notebook or web activity.</p>
    </div>
    <div class="section-title">📋 Lab specification</div>
    <div class="tbl-wrap"><table class="data"><tbody>${spec.map(([k, v]) => `<tr><th style="width:38%">${k}</th><td>${esc(v)}</td></tr>`).join('')}</tbody></table></div>
    <div class="section-title">🧭 How to build & run it</div>
    <div class="flow">${steps}</div>
    <div class="btn-row">
      <a class="btn" href="https://colab.research.google.com/#create=true" target="_blank" rel="noopener">▶ Open a free Colab notebook</a>
    </div>
    <a class="btn btn--ghost" href="#/catalogue">← Back to catalogue</a>
  </main>`;
}

/* ============================== DETAIL ============================== */
export function renderLab(id) {
  const l = labById(id);
  if (!l) return `<main class="page"><div class="empty"><div class="ico">🔬</div><h3>Lab not found</h3></div></main>`;

  const steps = l.steps.map((s, i) => `
    <div class="flow__step"><div class="flow__rail"><div class="flow__node" style="background:${l.color};box-shadow:0 0 0 4px ${l.color}22">${i + 1}</div>
      ${i < l.steps.length - 1 ? `<div class="flow__line" style="background:linear-gradient(${l.color}, ${l.color}55)"></div>` : ''}</div>
      <div class="flow__card"><h5>${esc(s.title)}</h5><p>${esc(s.text)}</p></div></div>`).join('');

  const toolkit = l.toolkit.map(t => `<span class="chip">${esc(t)}</span>`).join('');
  const resources = (l.resources || []).map(r =>
    `<a class="btn btn--ghost" href="${r.href}" target="_blank" rel="noopener">🔗 ${esc(r.label)}</a>`).join('');
  const code = l.code ? `<div class="section-title">💻 Sample code</div><pre class="code"><code>${esc(l.code)}</code></pre>` : '';
  const tool = l.tool ? `<div class="section-title">▶ Interactive tool</div><div class="lab-tool" id="labtool" data-tool="${l.tool}" data-color="${l.color}">${renderTool(l.tool, l.color)}</div>` : '';

  return `<main class="page">
    <div class="reader-head">
      <div class="kicker" style="color:${l.color}">${icon(l.icon, 15)} Technical Lab</div>
      <h1>${esc(l.title)}</h1>
      <p class="lead">${esc(l.about)}</p>
    </div>
    <div class="reader-meta">${toolkit}</div>
    ${tool}
    <div class="section-title">🧭 How this lab works</div>
    <div class="flow">${steps}</div>
    ${code}
    <div class="callout callout--tip"><div class="callout__label">🏛️ In real universities</div><p>${esc(l.university)}</p></div>
    ${resources ? `<div class="section-title">📚 Free tools & data</div><div class="lab-res">${resources}</div>` : ''}
  </main>`;
}

/* ============================== TOOLS (markup) ============================== */
function renderTool(kind, color) {
  switch (kind) {
    case 'regression': return `
      <p class="tool-hint">Enter X,Y pairs (one per line, comma-separated). Try the demo values, then Run.</p>
      <textarea id="reg-data" class="tool-ta" rows="6">1, 3
2, 4
3, 8
4, 9
5, 12
6, 13</textarea>
      <button class="btn js-run" style="background:${color}">▶ Run OLS regression</button>
      <div id="reg-out"></div>`;

    case 'compound': return `
      <div class="tool-grid">
        <label>Amount / GDP (₹)<input id="cp-p" type="number" value="100" class="tool-in"></label>
        <label>Growth rate (% p.a.)<input id="cp-r" type="number" value="7" class="tool-in"></label>
        <label>Years<input id="cp-n" type="number" value="5" class="tool-in"></label>
      </div>
      <button class="btn js-run" style="background:${color}">▶ Project growth</button>
      <div id="cp-out"></div>`;

    case 'market': return `
      <div id="mk-svg"></div>
      <label class="tool-slider">Demand level <b id="mk-dv">50</b><input id="mk-d" type="range" min="20" max="80" value="50"></label>
      <label class="tool-slider">Supply level <b id="mk-sv">50</b><input id="mk-s" type="range" min="20" max="80" value="50"></label>
      <div id="mk-out"></div>`;

    case 'sentiment': return `
      <p class="tool-hint">Paste economic text — an RBI statement, Budget line, or business news.</p>
      <textarea id="se-data" class="tool-ta" rows="5">The economy showed strong and robust growth with rising investment and improving demand, though inflation risk and weak exports remain a concern.</textarea>
      <button class="btn js-run" style="background:${color}">▶ Analyze sentiment</button>
      <div id="se-out"></div>`;

    case 'game': return `
      <p class="tool-hint">Ultimatum Game — you have ₹100 to split with a responder. How much do you offer them?</p>
      <label class="tool-slider">Your offer ₹<b id="gm-ov">30</b><input id="gm-o" type="range" min="0" max="100" value="30"></label>
      <button class="btn js-run" style="background:${color}">▶ Make the offer</button>
      <div id="gm-out"></div>`;

    case 'timeseries': return `
      <p class="tool-hint">Enter closing prices, comma or newline separated.</p>
      <textarea id="ts-data" class="tool-ta" rows="3">100, 102, 101, 105, 110, 108, 112, 115, 113, 118</textarea>
      <button class="btn js-run" style="background:${color}">▶ Compute returns & risk</button>
      <div id="ts-out"></div>`;

    default: return '';
  }
}

/* ============================== TOOLS (logic) ============================== */
export function wireLabs() {
  // Catalogue filters
  const catList = document.getElementById('cat-list');
  if (catList) {
    renderCatalogueList();
    wirePager(catList);
    const q = document.getElementById('cat-q');
    if (q) q.addEventListener('input', () => { catState.q = q.value; catState.page = 1; renderCatalogueList(); wirePager(catList); });
    document.querySelectorAll('.fchip').forEach(b => b.addEventListener('click', () => {
      catState[b.dataset.f] = b.dataset.v;
      catState.page = 1;
      document.querySelectorAll(`.fchip[data-f="${b.dataset.f}"]`).forEach(x => x.classList.toggle('active', x === b));
      renderCatalogueList();
      wirePager(catList);
    }));
  }

  const host = document.getElementById('labtool');
  if (!host) return;
  const kind = host.dataset.tool;
  wireCatalogueTool(host, kind);
}

// Delegated so it keeps working after renderCatalogueList() replaces the innerHTML.
function wirePager(catList) {
  if (catList._pagerWired) return;
  catList._pagerWired = true;
  catList.addEventListener('click', e => {
    const b = e.target.closest('.js-cat-page');
    if (!b || b.disabled) return;
    const p = parseInt(b.dataset.page, 10);
    if (!Number.isNaN(p)) {
      catState.page = p;
      renderCatalogueList();
      document.querySelector('.reader-head')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

function wireCatalogueTool(host, kind) {
  const color = host.dataset.color;
  const run = host.querySelector('.js-run');

  if (kind === 'regression') run.addEventListener('click', () => {
    const pts = parsePairs(document.getElementById('reg-data').value);
    const out = document.getElementById('reg-out');
    if (pts.length < 2) { out.innerHTML = err('Enter at least 2 valid X,Y pairs.'); return; }
    const { a, b, r2 } = ols(pts);
    out.innerHTML = `${scatterSVG(pts, a, b, color)}
      <div class="tool-result">
        <div class="stat"><b>Ŷ = ${a.toFixed(2)} ${b >= 0 ? '+' : '−'} ${Math.abs(b).toFixed(2)}·X</b><span>Estimated regression line</span></div>
        <div class="stat-row"><div class="stat"><b>${b.toFixed(3)}</b><span>Slope (effect of X)</span></div>
        <div class="stat"><b>${a.toFixed(3)}</b><span>Intercept</span></div>
        <div class="stat"><b>${(r2 * 100).toFixed(1)}%</b><span>R² (fit)</span></div></div>
        <p class="tool-note">Interpretation: a one-unit rise in X changes Y by ${b.toFixed(2)} on average. R² of ${(r2 * 100).toFixed(1)}% of the variation in Y is explained by X.</p>
      </div>`;
  });

  if (kind === 'compound') run.addEventListener('click', () => {
    const P = +document.getElementById('cp-p').value, r = +document.getElementById('cp-r').value / 100, n = Math.min(+document.getElementById('cp-n').value, 40);
    const rows = []; let v = P;
    for (let i = 1; i <= n; i++) { v = v * (1 + r); rows.push([i, v.toFixed(2)]); }
    const cagr = (Math.pow(v / P, 1 / n) - 1) * 100;
    document.getElementById('cp-out').innerHTML = `<div class="tool-result">
      <div class="stat-row"><div class="stat"><b>₹${v.toFixed(2)}</b><span>After ${n} yrs</span></div>
      <div class="stat"><b>${((v - P) / P * 100).toFixed(1)}%</b><span>Total growth</span></div>
      <div class="stat"><b>${cagr.toFixed(2)}%</b><span>CAGR</span></div></div>
      <div class="tbl-wrap"><table class="data"><thead><tr><th>Year</th><th>Value (₹)</th></tr></thead><tbody>${rows.map(x => `<tr><td>${x[0]}</td><td>${x[1]}</td></tr>`).join('')}</tbody></table></div></div>`;
  });

  if (kind === 'market') {
    const draw = () => {
      const d = +document.getElementById('mk-d').value, s = +document.getElementById('mk-s').value;
      document.getElementById('mk-dv').textContent = d;
      document.getElementById('mk-sv').textContent = s;
      // Equilibrium: demand P = d*2 - Q ; supply P = Q + (100-s)... simple linear intersection
      const eqQ = Math.round((d * 2 - (100 - s)) / 2);
      const eqP = Math.round(eqQ + (100 - s));
      document.getElementById('mk-svg').innerHTML = marketSVG(d, s, color);
      document.getElementById('mk-out').innerHTML = `<div class="tool-result"><div class="stat-row">
        <div class="stat"><b>₹${Math.max(eqP, 0)}</b><span>Equilibrium price P*</span></div>
        <div class="stat"><b>${Math.max(eqQ, 0)}</b><span>Equilibrium qty Q*</span></div></div>
        <p class="tool-note">Where demand meets supply, the market clears. Raising demand pushes P* and Q* up; raising supply lowers P* but raises Q*.</p></div>`;
    };
    document.getElementById('mk-d').addEventListener('input', draw);
    document.getElementById('mk-s').addEventListener('input', draw);
    draw();
  }

  if (kind === 'sentiment') run.addEventListener('click', () => {
    const res = analyzeSentiment(document.getElementById('se-data').value);
    const verdict = res.score > 1 ? ['Positive / Optimistic', 'var(--ok)'] : res.score < -1 ? ['Negative / Cautious', 'var(--danger)'] : ['Neutral / Mixed', 'var(--gold)'];
    document.getElementById('se-out').innerHTML = `<div class="tool-result">
      <div class="stat" style="border-left:4px solid ${verdict[1]}"><b style="color:${verdict[1]}">${verdict[0]}</b><span>Net tone score: ${res.score > 0 ? '+' : ''}${res.score}</span></div>
      <div class="stat-row"><div class="stat"><b style="color:var(--ok)">${res.pos}</b><span>Positive words</span></div>
      <div class="stat"><b style="color:var(--danger)">${res.neg}</b><span>Negative words</span></div>
      <div class="stat"><b>${res.total}</b><span>Words scanned</span></div></div>
      ${res.hits.length ? `<p class="tool-note">Detected: ${res.hits.map(h => `<span class="tok tok--${h.p ? 'pos' : 'neg'}">${esc(h.w)}</span>`).join(' ')}</p>` : '<p class="tool-note">No sentiment-bearing economic words found.</p>'}
      <p class="tool-note">This is a lexicon method (like the Loughran–McDonald finance dictionary). For large document sets, economists use Python (VADER, transformers).</p></div>`;
  });

  if (kind === 'game') run.addEventListener('click', () => {
    const offer = +document.getElementById('gm-o').value;
    // Responder rejects low offers with rising probability (fairness preference)
    const rejectProb = offer >= 40 ? 0.05 : offer >= 25 ? 0.35 : offer >= 15 ? 0.7 : 0.92;
    const rejected = Math.random() < rejectProb;
    document.getElementById('gm-out').innerHTML = `<div class="tool-result">
      <div class="stat" style="border-left:4px solid ${rejected ? 'var(--danger)' : 'var(--ok)'}">
        <b style="color:${rejected ? 'var(--danger)' : 'var(--ok)'}">${rejected ? 'Offer REJECTED — both get ₹0' : 'Offer ACCEPTED'}</b>
        <span>${rejected ? 'The responder punished an unfair split.' : `You keep ₹${100 - offer}, responder gets ₹${offer}.`}</span></div>
      <p class="tool-note">Rational theory predicts any positive offer is accepted, so proposers should offer ₹1. In reality, responders reject unfair offers — evidence of <b>fairness preferences</b>, a core finding of behavioral economics.</p></div>`;
  });

  if (kind === 'timeseries') run.addEventListener('click', () => {
    const px = document.getElementById('ts-data').value.split(/[,\n\s]+/).map(Number).filter(x => !isNaN(x));
    const out = document.getElementById('ts-out');
    if (px.length < 3) { out.innerHTML = err('Enter at least 3 prices.'); return; }
    const rets = []; for (let i = 1; i < px.length; i++) rets.push((px[i] - px[i - 1]) / px[i - 1]);
    const mean = rets.reduce((a, c) => a + c, 0) / rets.length;
    const vol = Math.sqrt(rets.reduce((a, c) => a + (c - mean) ** 2, 0) / rets.length);
    const total = (px[px.length - 1] - px[0]) / px[0];
    out.innerHTML = `${sparkSVG(px, color)}<div class="tool-result"><div class="stat-row">
      <div class="stat"><b>${(total * 100).toFixed(1)}%</b><span>Total return</span></div>
      <div class="stat"><b>${(mean * 100).toFixed(2)}%</b><span>Avg period return</span></div>
      <div class="stat"><b>${(vol * 100).toFixed(2)}%</b><span>Volatility (risk)</span></div></div>
      <p class="tool-note">Volatility (standard deviation of returns) measures risk. Higher volatility = a riskier series. Extend with ARIMA/GARCH in Python or R for forecasting.</p></div>`;
  });
}

/* ============================== math + svg helpers ============================== */
function parsePairs(txt) {
  return txt.split('\n').map(l => l.split(',').map(Number)).filter(p => p.length >= 2 && !isNaN(p[0]) && !isNaN(p[1]));
}
function ols(pts) {
  const n = pts.length, sx = pts.reduce((a, p) => a + p[0], 0), sy = pts.reduce((a, p) => a + p[1], 0);
  const mx = sx / n, my = sy / n;
  let num = 0, den = 0; pts.forEach(p => { num += (p[0] - mx) * (p[1] - my); den += (p[0] - mx) ** 2; });
  const b = den ? num / den : 0, a = my - b * mx;
  let sst = 0, ssr = 0; pts.forEach(p => { sst += (p[1] - my) ** 2; ssr += (p[1] - (a + b * p[0])) ** 2; });
  return { a, b, r2: sst ? 1 - ssr / sst : 0 };
}
function scatterSVG(pts, a, b, color) {
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const xmin = Math.min(...xs), xmax = Math.max(...xs), ymin = Math.min(...ys), ymax = Math.max(...ys);
  const sx = x => 40 + (x - xmin) / (xmax - xmin || 1) * 270;
  const sy = y => 165 - (y - ymin) / (ymax - ymin || 1) * 150;
  const dots = pts.map(p => `<circle cx="${sx(p[0])}" cy="${sy(p[1])}" r="4.5" fill="${color}"/>`).join('');
  const line = `<line x1="${sx(xmin)}" y1="${sy(a + b * xmin)}" x2="${sx(xmax)}" y2="${sy(a + b * xmax)}" stroke="${color}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
  return `<div class="figure"><svg viewBox="0 0 330 185"><line x1="40" y1="10" x2="40" y2="165" stroke="var(--line)"/><line x1="40" y1="165" x2="320" y2="165" stroke="var(--line)"/>${line}${dots}</svg></div>`;
}
function marketSVG(d, s, color) {
  // Demand: downward line shifted by d ; Supply: upward line shifted by s
  const dY0 = 165 - (d - 20) * 1.6, dY1 = 30 - (d - 50) * 0.4;
  const sY0 = 165 - (s - 20) * 0.4, sY1 = 30 - (s - 20) * 1.6;
  return `<div class="figure"><svg viewBox="0 0 330 190">
    <line x1="40" y1="10" x2="40" y2="165" stroke="var(--line)"/><line x1="40" y1="165" x2="320" y2="165" stroke="var(--line)"/>
    <text x="8" y="90" font-size="11" fill="var(--ink-soft)" transform="rotate(-90 12 90)">Price</text>
    <text x="270" y="182" font-size="11" fill="var(--ink-soft)">Quantity</text>
    <line x1="50" y1="${dY0}" x2="310" y2="${dY1}" stroke="#dc2626" stroke-width="2.5"/>
    <text x="288" y="${dY1 - 4}" font-size="12" fill="#dc2626" font-weight="700">D</text>
    <line x1="50" y1="${sY0}" x2="310" y2="${sY1}" stroke="${color}" stroke-width="2.5"/>
    <text x="288" y="${sY1 + 14}" font-size="12" fill="${color}" font-weight="700">S</text>
  </svg></div>`;
}
function sparkSVG(px, color) {
  const min = Math.min(...px), max = Math.max(...px), n = px.length;
  const pts = px.map((p, i) => `${40 + i / (n - 1) * 270},${160 - (p - min) / (max - min || 1) * 140}`).join(' ');
  return `<div class="figure"><svg viewBox="0 0 330 175"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/></svg></div>`;
}
function err(m) { return `<div class="explain" style="background:var(--danger-soft);border-color:var(--danger)">⚠️ ${esc(m)}</div>`; }

/* Lexicon-based economic sentiment (inspired by Loughran–McDonald) */
const POS = ['growth', 'grow', 'strong', 'robust', 'rising', 'rise', 'improve', 'improving', 'gain', 'boost', 'expansion', 'expand', 'surplus', 'profit', 'positive', 'optimistic', 'recovery', 'stable', 'boom', 'confidence', 'opportunity', 'up', 'higher', 'increase', 'record', 'resilient'];
const NEG = ['decline', 'fall', 'falling', 'weak', 'slow', 'slowdown', 'recession', 'deficit', 'loss', 'crisis', 'risk', 'inflation', 'unemployment', 'downturn', 'concern', 'uncertain', 'uncertainty', 'contraction', 'shrink', 'lower', 'drop', 'negative', 'poverty', 'debt', 'default', 'volatile', 'pessimistic'];
function analyzeSentiment(text) {
  const words = text.toLowerCase().match(/[a-z]+/g) || [];
  let pos = 0, neg = 0; const hits = [];
  words.forEach(w => {
    if (POS.includes(w)) { pos++; if (hits.length < 24) hits.push({ w, p: true }); }
    else if (NEG.includes(w)) { neg++; if (hits.length < 24) hits.push({ w, p: false }); }
  });
  return { pos, neg, score: pos - neg, total: words.length, hits };
}
