// ArthaRoshni — student / teacher accounts.
//
// Built directly on Supabase Auth. Email verification and password reset both use
// 6-digit OTP codes rather than magic links, which requires the Supabase email
// templates to contain {{ .Token }} — see DEPLOYMENT.md.
//
// The app router is synchronous, so the session is cached here at boot and route
// guards read it synchronously via Auth.isAuthed().
import { getSupabase, CLOUD_ENABLED } from './supabase.js';

let _session = null;
let _profile = null;
let _ready = false;
let _onChange = null;

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

/* ------------------------------------------------ password strength */
export function passwordScore(pw) {
  const checks = {
    length: (pw || '').length >= 8,
    upper: /[A-Z]/.test(pw || ''),
    lower: /[a-z]/.test(pw || ''),
    digit: /\d/.test(pw || ''),
    symbol: /[^A-Za-z0-9]/.test(pw || ''),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const longEnough = (pw || '').length >= 12;
  return { checks, score: longEnough ? Math.min(5, score + 1) : score };
}
const STRENGTH_LABEL = ['Very weak', 'Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];

// A password must be >=8 chars and mix at least three character classes.
export function passwordOk(pw) {
  const { checks } = passwordScore(pw);
  const classes = [checks.upper, checks.lower, checks.digit, checks.symbol].filter(Boolean).length;
  return checks.length && classes >= 3;
}

/* ------------------------------------------------ session lifecycle */
export const Auth = {
  ready: () => _ready,
  enabled: () => CLOUD_ENABLED,
  session: () => _session,
  user: () => _session?.user || null,
  profile: () => _profile,
  isAuthed: () => !!_session?.user,
  displayName: () => _profile?.full_name || _session?.user?.email || 'Account',

  async init(onChange) {
    _onChange = onChange;
    if (!CLOUD_ENABLED) { _ready = true; return; }
    const sb = await getSupabase();
    if (!sb) { _ready = true; return; }
    const { data } = await sb.auth.getSession();
    _session = data.session || null;
    if (_session) await loadProfile();
    _ready = true;
    sb.auth.onAuthStateChange(async (_evt, sess) => {
      const had = !!_session;
      _session = sess || null;
      _profile = _session ? _profile : null;
      if (_session) await loadProfile();
      if (had !== !!_session) _onChange?.();
    });
  },

  async signOut() {
    const sb = await getSupabase();
    await sb?.auth.signOut();
    _session = null; _profile = null;
  },
};

async function loadProfile() {
  try {
    const sb = await getSupabase();
    const { data } = await sb.from('profiles')
      .select('full_name,role,user_type,email,phone,organisation')
      .eq('id', _session.user.id).single();
    _profile = data || null;
  } catch { _profile = null; }
}

/* ------------------------------------------------ shared chrome */
function authShell(title, sub, body, foot = '') {
  return `<main class="page auth-page">
    <div class="auth-card">
      <div class="auth-card__head">
        <div class="auth-card__mark">₹</div>
        <h1>${esc(title)}</h1>
        <p>${esc(sub)}</p>
      </div>
      ${body}
      ${foot ? `<div class="auth-card__foot">${foot}</div>` : ''}
    </div>
  </main>`;
}

function offlineNotice() {
  return authShell('Accounts unavailable', 'The account service is not reachable right now.',
    `<div class="auth-msg auth-msg--err">Please try again in a moment. Chapter notes, quizzes and the Blueprint all still work without an account.</div>`,
    `<a href="#/">← Back to home</a>`);
}

/* ------------------------------------------------ views */
export function viewSignup(returnTo = '#/labs') {
  if (!CLOUD_ENABLED) return offlineNotice();
  return authShell('Create your account', 'Free forever — unlocks all 500 technical labs.', `
    <form class="auth-form js-authsignup" data-return="${esc(returnTo)}" novalidate>
      <label class="auth-f">Full name <span class="req">*</span>
        <input name="full_name" type="text" required autocomplete="name" placeholder="e.g. Roshani Kumari">
      </label>
      <label class="auth-f">I am a <span class="req">*</span>
        <select name="user_type" required>
          <option value="">Select your role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="professional">Working professional</option>
          <option value="other">Other</option>
        </select>
      </label>
      <label class="auth-f">Email <span class="req">*</span>
        <input name="email" type="email" required autocomplete="email" placeholder="you@example.com">
        <small>You'll use this to sign in. Never shown publicly.</small>
      </label>
      <label class="auth-f">Phone <span class="opt">optional</span>
        <input name="phone" type="tel" autocomplete="tel" placeholder="+91 98765 43210">
      </label>
      <label class="auth-f">School / organisation <span class="opt">optional</span>
        <input name="organisation" type="text" autocomplete="organization" placeholder="e.g. Kendriya Vidyalaya, Patna">
      </label>
      <label class="auth-f">Create password <span class="req">*</span>
        <span class="auth-pw">
          <input name="password" type="password" required autocomplete="new-password" placeholder="At least 8 characters">
          <button type="button" class="auth-eye js-eye" aria-label="Show password">show</button>
        </span>
        <span class="pw-meter"><span class="pw-meter__bar js-pwbar"></span></span>
        <small class="js-pwhint">Hint: use 8+ characters mixing capitals, small letters, a number and a symbol — e.g. <b>Roshni@2026</b>. Avoid your name or birthday.</small>
      </label>
      <label class="auth-f">Confirm password <span class="req">*</span>
        <input name="confirm" type="password" required autocomplete="new-password" placeholder="Re-enter your password">
      </label>
      <div class="auth-msg js-msg" hidden></div>
      <button class="c-btn c-btn--primary c-btn--lg auth-submit js-submit" type="submit">Create account →</button>
      <p class="auth-note">Your details stay with ArthaRoshni. We never sell or share them.</p>
    </form>`,
    `Already have an account? <a href="#/login">Sign in</a>`);
}

export function viewLogin(params) {
  if (!CLOUD_ENABLED) return offlineNotice();
  const flash = params[0] === 'created' ? 'Account created — sign in with your email and password.'
    : '';
  return authShell('Sign in', 'Welcome back to ArthaRoshni.', `
    <form class="auth-form js-login" novalidate>
      ${flash ? `<div class="auth-msg auth-msg--ok">${esc(flash)}</div>` : ''}
      <label class="auth-f">Email
        <input name="email" type="email" required autocomplete="email" placeholder="you@example.com">
      </label>
      <label class="auth-f">Password
        <span class="auth-pw">
          <input name="password" type="password" required autocomplete="current-password" placeholder="Your password">
          <button type="button" class="auth-eye js-eye" aria-label="Show password">show</button>
        </span>
      </label>
      <div class="auth-msg js-msg" hidden></div>
      <button class="c-btn c-btn--primary c-btn--lg auth-submit js-submit" type="submit">Sign in →</button>
      <p class="auth-note">Forgot your password? Write to us from your registered email and we'll reset it.</p>
    </form>`,
    `New to ArthaRoshni? <a href="#/signup">Create a free account</a>`);
}

/* The screen shown when a signed-out visitor hits a locked lab route. */
export function viewLocked(returnTo, what = 'the labs') {
  return `<main class="page auth-page">
    <div class="auth-card auth-card--lock">
      <div class="lock-badge">🔒</div>
      <h1>Sign in to open ${esc(what)}</h1>
      <p class="lock-lead">ArthaRoshni's technical labs are free, but they're for registered learners only. Create an account — it takes under a minute — and every one of the 500 labs unlocks.</p>
      <ul class="lock-list">
        <li>All 500 hands-on labs across 10 tracks</li>
        <li>The full downloadable lab catalogue</li>
        <li>Your progress saved across devices</li>
      </ul>
      <div class="lock-actions">
        <a class="c-btn c-btn--primary c-btn--lg" href="#/signup/${encodeURIComponent(returnTo)}">Create a free account →</a>
        <a class="c-btn c-btn--outline c-btn--lg" href="#/login">I already have one</a>
      </div>
      <p class="auth-note">Chapter notes, quizzes and the Blueprint stay free without an account.</p>
    </div>
  </main>`;
}

/* ------------------------------------------------ wiring */
const setMsg = (form, text, kind = 'err') => {
  const box = form.querySelector('.js-msg');
  if (!box) return;
  box.hidden = !text;
  box.textContent = text || '';
  box.className = `auth-msg js-msg ${text ? 'auth-msg--' + kind : ''}`;
};
const busy = (form, on, label) => {
  const b = form.querySelector('.js-submit');
  if (!b) return;
  b.disabled = on;
  if (on) { b.dataset.label = b.textContent; b.textContent = label || 'Working…'; }
  else if (b.dataset.label) b.textContent = b.dataset.label;
};

// Supabase errors can be noisy; keep them human and non-enumerating.
function friendly(error) {
  const m = (error?.message || '').toLowerCase();
  if (m.includes('invalid login credentials')) return 'That email and password combination is not correct.';
  // Appears only if "Confirm email" is still ON in Supabase Auth settings —
  // it must be OFF, since this site sends no emails (see DEPLOYMENT.md).
  if (m.includes('email not confirmed')) return 'This account is not activated yet. Please try again later.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'An account with this email already exists. Try signing in instead.';
  if (m.includes('rate limit') || m.includes('too many') || m.includes('security purposes')) return 'Too many attempts. Please wait a minute and try again.';
  if (m.includes('password')) return error.message;
  return error?.message || 'Something went wrong. Please try again.';
}

function wirePasswordUx(scope) {
  scope.querySelectorAll('.js-eye').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.textContent = show ? 'hide' : 'show';
    });
  });
  const pw = scope.querySelector('input[name="password"]');
  const bar = scope.querySelector('.js-pwbar');
  if (pw && bar) {
    pw.addEventListener('input', () => {
      const { score } = passwordScore(pw.value);
      bar.style.width = `${(score / 5) * 100}%`;
      bar.dataset.level = String(score);
      bar.title = STRENGTH_LABEL[score];
    });
  }
}

export function wireAuth(rerender) {
  const go = h => { location.hash = h; };

  /* --- signup --- */
  // NB: `js-authsignup`, not `js-signup` — the latter was the old catalogue form.
  const su = document.querySelector('.js-authsignup');
  if (su) {
    wirePasswordUx(su);
    su.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(su);
      const full_name = (fd.get('full_name') || '').trim();
      const user_type = fd.get('user_type') || '';
      const email = (fd.get('email') || '').trim().toLowerCase();
      const phone = (fd.get('phone') || '').trim();
      const organisation = (fd.get('organisation') || '').trim();
      const password = fd.get('password') || '';
      const confirm = fd.get('confirm') || '';

      if (!full_name) return setMsg(su, 'Please enter your full name.');
      if (!user_type) return setMsg(su, 'Please tell us whether you are a student, teacher or professional.');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setMsg(su, 'Please enter a valid email address.');
      if (!passwordOk(password)) return setMsg(su, 'Password too weak — use 8+ characters mixing capitals, small letters, a number or a symbol.');
      if (password !== confirm) return setMsg(su, 'The two passwords do not match.');

      setMsg(su, ''); busy(su, true, 'Creating account…');
      const sb = await getSupabase();
      const { error } = await sb.auth.signUp({
        email, password,
        // Only user_type/phone/organisation go in metadata. The DB trigger ignores
        // anything role-shaped here, so this cannot be used to self-promote.
        options: { data: { full_name, user_type, phone, organisation } },
      });
      if (error) { busy(su, false); return setMsg(su, friendly(error)); }
      // No email verification (no SMTP available on this domain). signUp() may
      // auto-create a session — sign it out so the user completes a deliberate
      // first login, as requested.
      const { data: sess } = await sb.auth.getSession();
      if (sess?.session) await sb.auth.signOut();
      busy(su, false);
      go('#/login/created');
    });
  }

  /* --- login --- */
  const lf = document.querySelector('.js-login');
  if (lf) {
    wirePasswordUx(lf);
    lf.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(lf);
      const email = (fd.get('email') || '').trim().toLowerCase();
      const password = fd.get('password') || '';
      if (!email || !password) return setMsg(lf, 'Enter your email and password.');
      setMsg(lf, ''); busy(lf, true, 'Signing in…');
      const sb = await getSupabase();
      const { error } = await sb.auth.signInWithPassword({ email, password });
      busy(lf, false);
      if (error) return setMsg(lf, friendly(error));
      const back = sessionStorage.getItem('ar.returnTo') || '#/labs';
      sessionStorage.removeItem('ar.returnTo');
      location.hash = back;
      rerender?.();
    });
  }

  /* --- sign out --- */
  document.querySelectorAll('.js-signout').forEach(b => b.addEventListener('click', async e => {
    e.preventDefault();
    await Auth.signOut();
    location.hash = '#/';
    rerender?.();
  }));
}
