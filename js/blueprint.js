// India's Economic Blueprint — interactive explorer page.
// Blueprint-styled (dark navy + cyan drafting lines) with a clickable India
// map, an 8-chapter 3D pipeline, and animated infographics per chapter.
// Zero dependencies — CSS 3D + SVG + IntersectionObserver only.

import { BLUEPRINT, BP_CHAPTERS, bpChapterById } from '../data/blueprint.js';
import { icon } from './icons.js';

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------------------------------------------- India map (stylised SVG) */
const INDIA_PATH = `M150 18 L186 44 L206 40 L252 68 L300 84 L332 78 L356 86 L344 106
L362 130 L342 152 L318 136 L308 118 L300 150 L295 165 L272 200 L256 240 L236 288
L216 340 L196 394 L188 412 L176 396 L162 332 L150 282 L140 232 L126 202 L98 186
L72 192 L60 176 L82 160 L96 166 L100 150 L76 144 L92 128 L102 118 L116 82 L136 56 Z`;

function indiaMap(activeId) {
  const links = BP_CHAPTERS.map((c, i) => {
    const n = BP_CHAPTERS[(i + 1) % BP_CHAPTERS.length].node;
    return `<line x1="${c.node.x}" y1="${c.node.y}" x2="${n.x}" y2="${n.y}" class="bp-map__link"/>`;
  }).join('');
  const nodes = BP_CHAPTERS.map(c => `
    <g class="bp-map__node ${activeId === c.id ? 'active' : ''}" data-ch="${c.id}" tabindex="0" role="button"
       aria-label="Chapter ${c.num}: ${esc(c.title)}">
      <circle cx="${c.node.x}" cy="${c.node.y}" r="14" class="halo" style="--node:${c.color}"/>
      <circle cx="${c.node.x}" cy="${c.node.y}" r="7.5" class="dot" style="--node:${c.color}"/>
      <text x="${c.node.x}" y="${c.node.y + 3.4}" text-anchor="middle" class="num">${c.num}</text>
      <text x="${c.node.x}" y="${c.node.y - 14}" text-anchor="middle" class="lbl">${esc(c.node.city)}</text>
    </g>`).join('');
  return `
  <svg class="bp-map" viewBox="30 0 360 440" role="img" aria-label="Blueprint map of India with 8 chapter nodes">
    <defs>
      <radialGradient id="bpGlow" cx="50%" cy="45%" r="65%">
        <stop offset="0%" stop-color="rgba(103,232,249,.14)"/><stop offset="100%" stop-color="rgba(103,232,249,0)"/>
      </radialGradient>
    </defs>
    <path d="${INDIA_PATH}" class="bp-map__land" fill="url(#bpGlow)"/>
    <path d="${INDIA_PATH}" class="bp-map__trace"/>
    ${links}${nodes}
  </svg>`;
}

/* ---------------------------------------------- pipeline of 8 chapters */
function pipeline(activeId) {
  const nodes = BP_CHAPTERS.map(c => `
    <a class="bp-node ${activeId === c.id ? 'active' : ''}" href="#/blueprint/${c.id}" style="--node:${c.color}">
      <span class="bp-node__num">${String(c.num).padStart(2, '0')}</span>
      <span class="bp-node__face">
        <span class="bp-node__ic">${icon(c.icon, 26)}</span>
        <span class="bp-node__era">${esc(c.era)}</span>
        <span class="bp-node__t">${esc(c.short)}</span>
      </span>
    </a>`).join('<span class="bp-node__pipe" aria-hidden="true"></span>');
  return `<div class="bp-pipeline"><div class="bp-pipeline__track">${nodes}</div></div>`;
}

/* ---------------------------------------------- shared partials */
const factCards = facts => `
  <div class="bp-facts">${facts.map(f => `
    <div class="bp-card bp-tilt reveal">
      <span class="bp-card__ic">${icon(f.icon, 22)}</span>
      <span class="bp-card__k">${esc(f.k)}</span>
      <b class="bp-card__v">${esc(f.v)}</b>
      <p>${esc(f.d)}</p>
    </div>`).join('')}
  </div>`;

const sectionHead = (t, sub) => `
  <div class="bp-sec__head reveal"><h3>${esc(t)}</h3>${sub ? `<p>${esc(sub)}</p>` : ''}</div>`;

/* ---------------------------------------------- per-chapter stages */
function stageColonial(c) {
  const cyc = c.cycle.steps.map((s, i) => `
    <div class="bp-cycle__step reveal" style="--i:${i}">
      <span class="n">${i + 1}</span><b>${esc(s.t)}</b><p>${esc(s.d)}</p>
    </div>`).join('');
  return `
  ${factCards(c.facts)}
  <div class="bp-sec reveal">
    ${sectionHead(c.drain.title, c.drain.sub)}
    <div class="bp-drain">
      <div class="bp-drain__side"><b>INDIA</b><small>85% agrarian</small>${icon('wheat', 30)}</div>
      <div class="bp-drain__flows">
        <div class="bp-flow bp-flow--out"><span>${esc(c.drain.out)}</span><i></i></div>
        <div class="bp-flow bp-flow--back"><i></i><span>${esc(c.drain.back)}</span></div>
      </div>
      <div class="bp-drain__side"><b>BRITAIN</b><small>Colonial power</small>${icon('factory', 30)}</div>
    </div>
    <div class="bp-alert">${icon('gears', 20)} ${esc(c.drain.result)}</div>
  </div>
  <div class="bp-grid2">
    <div class="bp-sec reveal">
      ${sectionHead(c.cycle.title)}
      <div class="bp-cycle">${cyc}</div>
    </div>
    <div class="bp-sec reveal">
      ${sectionHead('The Infrastructure Motive')}
      <div class="bp-timeline">
        ${c.timeline.map(t => `<div class="bp-timeline__row"><span class="y">${esc(t.y)}</span><span>${esc(t.t)}</span></div>`).join('')}
      </div>
      <div class="bp-alert bp-alert--amber">${icon('road', 20)} ${esc(c.timelineNote)}</div>
    </div>
  </div>`;
}

function stagePlanning(c) {
  const quad = c.goals.items.map(g => `
    <div class="bp-goal bp-tilt reveal">
      <span class="bp-card__ic">${icon(g.icon, 22)}</span><b>${esc(g.t)}</b><p>${esc(g.d)}</p>
    </div>`).join('');
  return `
  <div class="bp-sec reveal">
    ${sectionHead(c.goals.title, 'Four goals orbiting one framework')}
    <div class="bp-quad">
      <div class="bp-quad__grid">${quad}</div>
      <div class="bp-quad__center"><span>${esc(c.goals.center)}</span></div>
    </div>
  </div>
  ${factCards(c.facts)}
  <div class="bp-sec reveal">
    ${sectionHead(c.formula.title)}
    <div class="bp-formula">
      <div class="bp-formula__inputs">${c.formula.inputs.map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div>
      <span class="op">=</span>
      <div class="bp-formula__out bp-tilt"><b>${esc(c.formula.output)}</b><p>${esc(c.formula.outputDef)}</p></div>
    </div>
    <div class="bp-alert bp-alert--green">${icon('wheat', 20)} <b>Result:</b>&nbsp;${esc(c.formula.result)}</div>
  </div>`;
}

function stageReforms(c) {
  const cards = c.lpg.map((x, i) => `
    <div class="bp-lpg bp-tilt reveal" style="--i:${i}">
      <span class="bp-card__ic">${icon(x.icon, 24)}</span>
      <b>${esc(x.t)}</b><p>${esc(x.d)}</p>
    </div>`).join('');
  const vs = (side, cls) => `
    <div class="bp-vs__col ${cls} reveal"><b>${esc(side.title)}</b>
      ${side.items.map(i => `<span>${esc(i)}</span>`).join('')}</div>`;
  return `
  <div class="bp-alert bp-alert--amber reveal" style="font-size:15px">${icon('sparkle', 20)} ${esc(c.crisis)}</div>
  <div class="bp-sec reveal">
    ${sectionHead('The L·P·G Reforms', 'Three levers pulled at once')}
    <div class="bp-lpg__row">${cards}</div>
  </div>
  <div class="bp-sec reveal">
    ${sectionHead('Before vs after')}
    <div class="bp-vs">${vs(c.versus.before, 'bad')}<span class="bp-vs__mid">VS</span>${vs(c.versus.after, 'good')}</div>
  </div>`;
}

function stagePillars(c) {
  const cards = c.pillars.map((p, i) => `
    <div class="bp-pillar bp-tilt reveal" style="--i:${i}">
      <span class="bp-card__ic">${icon(p.icon, 24)}</span>
      <b>${esc(p.t)}</b><span class="stat">${esc(p.stat)}</span><p>${esc(p.d)}</p>
    </div>`).join('');
  return `
  <div class="bp-sec reveal">
    ${sectionHead('Four pillars of post-1991 growth')}
    <div class="bp-pillars">${cards}</div>
  </div>
  <div class="bp-sec reveal">
    ${sectionHead(c.demography.title)}
    <div class="bp-demo">
      <div class="bp-demo__stat bp-tilt"><b>${esc(c.demography.stat)}</b><span>${esc(c.demography.statLabel)}</span></div>
      <div class="bp-demo__list">${c.demography.items.map(x => `<div class="row">${icon('users', 18)}<span>${esc(x)}</span></div>`).join('')}</div>
    </div>
  </div>`;
}

function stageHuman(c) {
  return `
  <div class="bp-sec reveal">
    ${sectionHead('Education ∩ Health', c.venn.caption)}
    <div class="bp-venn">
      <span class="c a">${esc(c.venn.a)}</span><span class="c b">${esc(c.venn.b)}</span>
    </div>
  </div>
  <div class="bp-grid2">
    ${c.compare.map(x => `
      <div class="bp-sec bp-tilt reveal" style="border-top:3px solid ${x.accent}">
        <h3 style="color:${x.accent}">${esc(x.t)}</h3><p class="bp-p">${esc(x.d)}</p>
      </div>`).join('')}
  </div>
  ${factCards(c.facts)}`;
}

function stageRural(c) {
  const f = c.flow;
  return `
  <div class="bp-sec reveal">
    ${sectionHead('The rural credit pipeline')}
    <div class="bp-rural">
      <div class="bp-rural__crossed reveal"><b>${esc(f.crossed.t)}</b><p>${esc(f.crossed.d)}</p><span class="x">✕</span></div>
      <div class="bp-rural__flow">
        <div class="bp-rural__box apex bp-tilt reveal"><b>${esc(f.apex.t)}</b><p>${esc(f.apex.d)}</p></div>
        <div class="bp-rural__arrow" aria-hidden="true"></div>
        <div class="bp-rural__mid">${f.mid.map(m => `<div class="bp-rural__box bp-tilt reveal"><b>${esc(m.t)}</b></div>`).join('')}</div>
        <div class="bp-rural__arrow" aria-hidden="true"></div>
        <div class="bp-rural__box shg bp-tilt reveal"><b>${esc(f.out.t)}</b><p>${esc(f.out.d)}</p></div>
      </div>
    </div>
    <div class="bp-alert bp-alert--green">${icon('leaf', 20)} ${esc(c.alt)}</div>
  </div>
  ${factCards(c.facts)}`;
}

function stageEmployment(c) {
  return `
  <div class="bp-sec reveal">
    ${sectionHead('GDP grew. But did the people?', c.paradox.title)}
    <div class="bp-chart">
      <svg viewBox="0 0 560 240" role="img" aria-label="GDP rises steeply while formal employment stays flat">
        <line x1="40" y1="200" x2="540" y2="200" class="ax"/><line x1="40" y1="20" x2="40" y2="200" class="ax"/>
        <path d="M40 190 C160 170 260 130 380 90 S 500 45 540 30" class="ln gdp"/>
        <path d="M40 196 C200 192 380 190 540 186" class="ln emp"/>
        <circle cx="290" cy="240" r="150" class="informal"/>
        <text x="548" y="34" text-anchor="end" class="t gdp">${esc(c.paradox.gdpLabel)}</text>
        <text x="548" y="178" text-anchor="end" class="t emp">${esc(c.paradox.empLabel)}</text>
        <text x="290" y="222" text-anchor="middle" class="t inf">THE INFORMAL SECTOR</text>
      </svg>
      <p class="bp-p center">${esc(c.paradox.informal)}</p>
    </div>
  </div>
  <div class="bp-sec reveal">
    ${sectionHead(c.carrying.title, c.carrying.sub)}
    <div class="bp-venn bp-venn--tri">
      <span class="c a">${esc(c.carrying.circles[0])}</span>
      <span class="c b">${esc(c.carrying.circles[1])}</span>
      <span class="c d">${esc(c.carrying.circles[2])}</span>
    </div>
    <div class="bp-alert bp-alert--amber">${icon('leaf', 20)} ${esc(c.carrying.breach)}</div>
  </div>
  ${factCards(c.facts)}`;
}

function stageGlobal(c) {
  const t = c.compare3;
  const rows = t.rows.map(r => `
    <tr><th>${esc(r.k)}</th>${r.v.map((v, i) => `<td class="c${i}">${esc(v)}</td>`).join('')}</tr>`).join('');
  return `
  <div class="bp-sec reveal">
    ${sectionHead(t.title, 'The blueprint continues to evolve.')}
    <div class="bp-tblwrap"><table class="bp-tbl">
      <thead><tr><th></th>${t.cols.map(x => `<th>${esc(x)}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </div>
  <div class="bp-sec reveal">
    ${sectionHead(c.drivers.title)}
    <div class="bp-drivers">
      <div class="bp-demo__list">${c.drivers.items.map(x => `<div class="row">${icon('sparkle', 18)}<span>${esc(x)}</span></div>`).join('')}</div>
      <div class="bp-drivers__arrow bp-tilt"><span>FUTURE TRAJECTORY</span><b>GLOBAL ECONOMIC POWERHOUSE</b></div>
    </div>
    <div class="bp-alert bp-alert--green">${icon('trendUp', 20)} ${esc(c.drivers.result)}</div>
  </div>`;
}

const STAGES = {
  'colonial-baseline': stageColonial,
  'planning-era': stagePlanning,
  'reforms-1991': stageReforms,
  'growth-pillars': stagePillars,
  'human-capital': stageHuman,
  'rural-lifeline': stageRural,
  'employment': stageEmployment,
  'global-emergence': stageGlobal,
};

/* ---------------------------------------------- page */
export function renderBlueprint(chapterId) {
  const active = bpChapterById(chapterId) || BP_CHAPTERS[0];
  const stats = BLUEPRINT.heroStats.map(s => s.plain
    ? `<div class="bp-stat"><b>${s.value}</b><span>${esc(s.label)}</span></div>`
    : `<div class="bp-stat"><b><span class="pre">${s.prefix || ''}</span><span class="js-count" data-to="${s.value}">0</span>${s.suffix || ''}</b><span>${esc(s.label)}</span></div>`).join('');

  const prev = BP_CHAPTERS[active.num - 2];
  const next = BP_CHAPTERS[active.num];

  return `
  <div class="bp">
    <section class="bp-hero">
      <div class="bp-hero__in">
        <div class="bp-hero__copy">
          <div class="bp-badge">${icon('compass', 16)} INTERACTIVE SPECIAL · INDIAN ECONOMIC DEVELOPMENT</div>
          <h1>${esc(BLUEPRINT.title)}</h1>
          <p class="sub">${esc(BLUEPRINT.subtitle)}. Tap a chapter node — on the map or the pipeline — to open its story with animated infographics.</p>
          <div class="bp-stats">${stats}</div>
          <div class="bp-hero__cta">
            <a class="c-btn c-btn--primary c-btn--lg" href="#/blueprint/colonial-baseline">${icon('play', 16)} Start Chapter 1</a>
            <a class="c-btn c-btn--outline c-btn--lg" href="#/class/class-12">Open the IED course</a>
          </div>
        </div>
        <div class="bp-hero__map">${indiaMap(active.id)}</div>
      </div>
    </section>

    <section class="bp-pipe-sec">
      <div class="bp-sec__head bp-sec__head--center">
        <h2>The 8-chapter pipeline</h2>
        <p>From colonial stagnation to global emergence — click any stage to explore it.</p>
      </div>
      ${pipeline(active.id)}
    </section>

    <section class="bp-stage" id="bp-stage" style="--node:${active.color}">
      <div class="bp-stage__head">
        <span class="bp-stage__era">${icon(active.icon, 18)} CHAPTER ${active.num} · ${esc(active.era)}</span>
        <h2>${esc(active.title)}</h2>
        <p>${esc(active.tagline)}</p>
      </div>
      <div class="bp-stage__body">${(STAGES[active.id] || (() => ''))(active)}</div>
      <div class="bp-stage__nav">
        ${prev ? `<a class="c-btn c-btn--outline" href="#/blueprint/${prev.id}">${icon('back', 16)} Ch ${prev.num} · ${esc(prev.short)}</a>` : '<span></span>'}
        ${next ? `<a class="c-btn c-btn--primary" href="#/blueprint/${next.id}">Ch ${next.num} · ${esc(next.short)} ${icon('arrow', 16)}</a>`
               : `<a class="c-btn c-btn--primary" href="#/class/class-12">Study the full IED course ${icon('arrow', 16)}</a>`}
      </div>
    </section>

    <section class="bp-foot">
      <p>Built from the NCERT Indian Economic Development storyline (Classes 11–12). Every chapter above maps to real course notes and quizzes on ArthaRoshni.</p>
      <div class="bp-foot__cta">
        <a class="c-btn c-btn--primary" href="#/class/class-11">Class 11 IED notes</a>
        <a class="c-btn c-btn--outline" href="#/class/class-12">Class 12 IED notes</a>
        <a class="c-btn c-btn--outline" href="#/practice">Practice quizzes</a>
      </div>
    </section>
  </div>`;
}

/* ---------------------------------------------- interactions */
export function wireBlueprint() {
  const page = document.querySelector('.bp');
  if (!page) return;

  // Map nodes → navigate to chapter
  page.querySelectorAll('.bp-map__node').forEach(n => {
    const go = () => { location.hash = `#/blueprint/${n.dataset.ch}`; };
    n.addEventListener('click', go);
    n.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });

  // Scroll the opened chapter into view when deep-linked
  if (/^#\/blueprint\/.+/.test(location.hash)) {
    setTimeout(() => document.getElementById('bp-stage')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  }

  // Count-up hero stats
  page.querySelectorAll('.js-count').forEach(el => {
    const to = +el.dataset.to, t0 = performance.now(), dur = 1200;
    const tick = now => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  // Scroll-reveal
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  page.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // 3D tilt on cards (pointer only, skipped on touch)
  if (matchMedia('(hover:hover)').matches) {
    page.querySelectorAll('.bp-tilt').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - .5) * -8;
        const ry = ((e.clientX - r.left) / r.width - .5) * 10;
        card.style.transform = `perspective(700px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-3px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }
}
