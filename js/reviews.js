// ArthaRoshni — real reviews from signed-in learners.
//
// Nothing here is seeded or invented: the homepage shows only reviews written by
// real accounts and approved by an admin. Until real ones exist, the section
// invites students and teachers to write the first.
//
// The router is synchronous, so approved reviews are fetched once at boot and
// cached; render() is called again when they arrive.
import { getSupabase, CLOUD_ENABLED } from './supabase.js';
import { Auth } from './auth.js';

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

let _approved = [];   // published reviews
let _mine = null;     // the signed-in user's own review, if any
let _loaded = false;

export const Reviews = {
  approved: () => _approved,
  mine: () => _mine,
  loaded: () => _loaded,
};

export async function loadReviews(onDone) {
  if (!CLOUD_ENABLED) { _loaded = true; return; }
  try {
    const sb = await getSupabase();
    if (!sb) { _loaded = true; return; }
    // RLS returns approved reviews to everyone, plus the caller's own pending one.
    const { data } = await sb.from('reviews')
      .select('id,name,role_label,user_type,rating,quote,approved,user_id,created_at')
      .order('created_at', { ascending: false });
    const rows = data || [];
    _approved = rows.filter(r => r.approved);
    const uid = Auth.user()?.id;
    _mine = uid ? rows.find(r => r.user_id === uid) || null : null;
  } catch { /* reviews are non-critical — never block the page */ }
  _loaded = true;
  onDone?.();
}

const stars = n => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);

/* ------------------------------------------------ homepage section */
export function reviewsSection(icon) {
  const authed = Auth.isAuthed();
  const cta = `<a class="c-btn c-btn--primary" href="#/review">
    ${icon ? icon('star', 15) : '★'} ${_mine ? 'Edit your review' : 'Write a review'}</a>`;

  if (!_approved.length) {
    // Honest empty state — no invented quotes to fill the space.
    return `<section class="mkt-sec" id="home-reviews">
      <div class="rev-invite">
        <div class="rev-invite__star">★</div>
        <h2>Are you learning with ArthaRoshni?</h2>
        <p>We don't publish made-up testimonials. This space is for real students and
           teachers — if ArthaRoshni has helped you, tell us and yours could be the first
           review here.</p>
        <div class="rev-invite__actions">
          ${cta}
          ${authed ? '' : '<a class="c-btn c-btn--outline" href="#/signup">Create a free account</a>'}
        </div>
        ${_mine && !_mine.approved ? `<p class="rev-pending">✓ Thanks — your review is submitted and waiting to be published.</p>` : ''}
      </div>
    </section>`;
  }

  const cards = _approved.map(r => `<div class="testi-card">
    <div class="stars" aria-label="${r.rating} out of 5">${stars(r.rating)}</div>
    <blockquote>“${esc(r.quote)}”</blockquote>
    <div class="who">
      <span class="av">${esc((r.name || '?').charAt(0).toUpperCase())}</span>
      <div><b>${esc(r.name)}</b><small>${esc(r.role_label || '')}</small></div>
    </div>
  </div>`).join('');

  const avg = (_approved.reduce((s, r) => s + r.rating, 0) / _approved.length).toFixed(1);
  return `<section class="mkt-sec" id="home-reviews">
    <div class="mkt-sec__head">
      <div><h2>Real Students. Real Progress.</h2>
        <p>${_approved.length} verified review${_approved.length === 1 ? '' : 's'} from learners
           with an ArthaRoshni account · ${avg} average.</p></div>
      ${cta}
    </div>
    <div class="testi-grid">${cards}</div>
    ${_mine && !_mine.approved ? `<p class="rev-pending">✓ Your review is submitted and waiting to be published.</p>` : ''}
  </section>`;
}

/* ------------------------------------------------ review form page */
export function viewReview(topbar) {
  if (!CLOUD_ENABLED) {
    return topbar('Write a review', 'Unavailable', { back: '#/' }) +
      `<main class="page"><div class="auth-card"><div class="auth-msg auth-msg--err">Reviews are unavailable right now. Please try again later.</div></div></main>`;
  }
  if (!Auth.isAuthed()) {
    try { sessionStorage.setItem('ar.returnTo', '#/review'); } catch {}
    return topbar('Write a review', 'Sign in first', { back: '#/' }) + `
    <main class="page auth-page"><div class="auth-card auth-card--lock">
      <div class="lock-badge">★</div>
      <h1>Sign in to write a review</h1>
      <p class="lock-lead">Reviews come only from real ArthaRoshni accounts — that's how we keep
        them honest. Sign in or create a free account to share your experience.</p>
      <div class="lock-actions">
        <a class="c-btn c-btn--primary c-btn--lg" href="#/login">Sign in</a>
        <a class="c-btn c-btn--outline c-btn--lg" href="#/signup">Create a free account</a>
      </div>
    </div></main>`;
  }

  const p = Auth.profile() || {};
  const m = _mine;
  const TYPE_HINT = { student: 'e.g. Class 12, Patna', teacher: 'e.g. Economics Teacher, Muzaffarpur', professional: 'e.g. Data Analyst, Bengaluru' };
  const rated = m?.rating || 5;
  return topbar(m ? 'Edit your review' : 'Write a review', 'Your experience, in your words', { back: '#/' }) + `
  <main class="page auth-page">
    <div class="auth-card">
      <div class="auth-card__head">
        <div class="auth-card__mark">★</div>
        <h1>${m ? 'Edit your review' : 'Write a review'}</h1>
        <p>You're posting as <b>${esc(p.full_name || Auth.user()?.email || '')}</b>. Reviews are
           checked before they appear on the homepage.</p>
      </div>
      <form class="auth-form js-reviewform" novalidate>
        <label class="auth-f">Your rating
          <span class="rate js-rate">
            ${[1, 2, 3, 4, 5].map(n => `<button type="button" class="rate__s ${n <= rated ? 'on' : ''}" data-n="${n}" aria-label="${n} star${n > 1 ? 's' : ''}">★</button>`).join('')}
          </span>
          <input type="hidden" name="rating" value="${rated}">
        </label>
        <label class="auth-f">How should we describe you? <span class="opt">shown under your name</span>
          <input name="role_label" type="text" maxlength="60"
                 value="${esc(m?.role_label || p.organisation || '')}"
                 placeholder="${esc(TYPE_HINT[p.user_type] || 'e.g. Class 11, Ranchi')}">
        </label>
        <label class="auth-f">Your review <span class="req">*</span>
          <textarea name="quote" rows="5" required maxlength="600" minlength="20"
                    placeholder="What actually helped you? Be specific — which chapters, labs or quizzes made a difference.">${esc(m?.quote || '')}</textarea>
          <small><span class="js-count">0</span>/600 · minimum 20 characters. Please write from your
                 own experience; anything else won't be published.</small>
        </label>
        <div class="auth-msg js-msg" hidden></div>
        <button class="c-btn c-btn--primary c-btn--lg auth-submit js-submit" type="submit">
          ${m ? 'Update review' : 'Submit review'} →</button>
        ${m ? '<button class="auth-link js-delete" type="button">Delete my review</button>' : ''}
        <p class="auth-note">Your name and the description above are shown publicly once approved.
           Your email is never published.</p>
      </form>
    </div>
  </main>`;
}

/* ------------------------------------------------ wiring */
export function wireReviews(rerender) {
  const f = document.querySelector('.js-reviewform');
  if (!f) return;

  const msg = (t, kind = 'err') => {
    const b = f.querySelector('.js-msg');
    b.hidden = !t; b.textContent = t || '';
    b.className = `auth-msg js-msg ${t ? 'auth-msg--' + kind : ''}`;
  };

  // star picker
  const hidden = f.querySelector('input[name="rating"]');
  f.querySelectorAll('.rate__s').forEach(btn => {
    btn.addEventListener('click', () => {
      const n = +btn.dataset.n;
      hidden.value = n;
      f.querySelectorAll('.rate__s').forEach(s => s.classList.toggle('on', +s.dataset.n <= n));
    });
  });

  // live character count
  const ta = f.querySelector('textarea[name="quote"]');
  const count = f.querySelector('.js-count');
  const sync = () => { count.textContent = ta.value.trim().length; };
  ta.addEventListener('input', sync); sync();

  f.addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(f);
    const quote = (fd.get('quote') || '').trim();
    const rating = +(fd.get('rating') || 0);
    const role_label = (fd.get('role_label') || '').trim();
    if (quote.length < 20) return msg('Please write at least 20 characters so it is useful to others.');
    if (quote.length > 600) return msg('Please keep your review under 600 characters.');
    if (!(rating >= 1 && rating <= 5)) return msg('Please choose a star rating.');

    const btn = f.querySelector('.js-submit');
    btn.disabled = true; btn.textContent = 'Sending…';
    const p = Auth.profile() || {};
    const sb = await getSupabase();
    // approved is deliberately not sent — the DB trigger forces it false anyway.
    const { error } = await sb.from('reviews').upsert({
      user_id: Auth.user().id,
      name: p.full_name || 'ArthaRoshni learner',
      role_label, user_type: p.user_type || null, rating, quote,
    }, { onConflict: 'user_id' });
    btn.disabled = false; btn.textContent = 'Submit review →';
    if (error) return msg(error.message);
    await loadReviews();
    msg('Thank you — your review is submitted and will appear once approved.', 'ok');
    setTimeout(() => { location.hash = '#/'; rerender?.(); }, 1400);
  });

  f.querySelector('.js-delete')?.addEventListener('click', async () => {
    if (!confirm('Delete your review?')) return;
    const sb = await getSupabase();
    await sb.from('reviews').delete().eq('user_id', Auth.user().id);
    await loadReviews();
    location.hash = '#/'; rerender?.();
  });
}
