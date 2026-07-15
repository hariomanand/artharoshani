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
        <small>We'll send a 6-digit code here to verify your account.</small>
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

export function viewVerify(params) {
  if (!CLOUD_ENABLED) return offlineNotice();
  const email = decodeURIComponent(params[0] || '');
  return authShell('Verify your email', `Enter the 6-digit code sent to ${email || 'your inbox'}.`, `
    <form class="auth-form js-verify" data-email="${esc(email)}" novalidate>
      <label class="auth-f">6-digit code
        <input name="token" inputmode="numeric" pattern="[0-9]*" maxlength="6" required
               autocomplete="one-time-code" placeholder="123456" class="auth-otp">
      </label>
      <div class="auth-msg js-msg" hidden></div>
      <button class="c-btn c-btn--primary c-btn--lg auth-submit js-submit" type="submit">Verify &amp; continue →</button>
      <button class="auth-link js-resend" type="button">Didn't get it? Resend code</button>
      <p class="auth-note">The code expires in about an hour. Check your spam folder if it hasn't arrived.</p>
    </form>`,
    `<a href="#/signup">← Use a different email</a>`);
}

export function viewLogin(params) {
  if (!CLOUD_ENABLED) return offlineNotice();
  const flash = params[0] === 'verified' ? 'Email verified — please sign in to continue.'
    : params[0] === 'reset' ? 'Password updated — please sign in with your new password.'
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
      <a class="auth-link" href="#/forgot">Forgot your password?</a>
    </form>`,
    `New to ArthaRoshni? <a href="#/signup">Create a free account</a>`);
}

export function viewForgot() {
  if (!CLOUD_ENABLED) return offlineNotice();
  return authShell('Reset your password', "We'll email you a 6-digit code.", `
    <form class="auth-form js-forgot" novalidate>
      <label class="auth-f">Email
        <input name="email" type="email" required autocomplete="email" placeholder="you@example.com">
      </label>
      <div class="auth-msg js-msg" hidden></div>
      <button class="c-btn c-btn--primary c-btn--lg auth-submit js-submit" type="submit">Send reset code →</button>
    </form>`,
    `<a href="#/login">← Back to sign in</a>`);
}

export function viewReset(params) {
  if (!CLOUD_ENABLED) return offlineNotice();
  const email = decodeURIComponent(params[0] || '');
  return authShell('Choose a new password', `Enter the code sent to ${email || 'your inbox'} and your new password.`, `
    <form class="auth-form js-pwreset" data-email="${esc(email)}" novalidate>
      <label class="auth-f">6-digit code
        <input name="token" inputmode="numeric" pattern="[0-9]*" maxlength="6" required
               autocomplete="one-time-code" placeholder="123456" class="auth-otp">
      </label>
      <label class="auth-f">New password
        <span class="auth-pw">
          <input name="password" type="password" required autocomplete="new-password" placeholder="At least 8 characters">
          <button type="button" class="auth-eye js-eye" aria-label="Show password">show</button>
        </span>
        <span class="pw-meter"><span class="pw-meter__bar js-pwbar"></span></span>
        <small class="js-pwhint">Hint: 8+ characters mixing capitals, small letters, a number and a symbol.</small>
      </label>
      <label class="auth-f">Confirm new password
        <input name="confirm" type="password" required autocomplete="new-password" placeholder="Re-enter your password">
      </label>
      <div class="auth-msg js-msg" hidden></div>
      <button class="c-btn c-btn--primary c-btn--lg auth-submit js-submit" type="submit">Update password →</button>
    </form>`,
    `<a href="#/login">← Back to sign in</a>`);
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
  if (m.includes('email not confirmed')) return 'Please verify your email first — check your inbox for the code.';
  if (m.includes('token has expired') || m.includes('expired')) return 'That code has expired. Request a new one.';
  if (m.includes('invalid') && m.includes('token')) return 'That code is not correct. Please re-check and try again.';
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
      busy(su, false);
      if (error) return setMsg(su, friendly(error));
      go(`#/verify/${encodeURIComponent(email)}`);
    });
  }

  /* --- verify signup OTP --- */
  const vf = document.querySelector('.js-verify');
  if (vf) {
    const email = vf.dataset.email;
    vf.addEventListener('submit', async e => {
      e.preventDefault();
      const token = (new FormData(vf).get('token') || '').trim();
      if (!/^\d{6}$/.test(token)) return setMsg(vf, 'Enter the 6-digit code from your email.');
      setMsg(vf, ''); busy(vf, true, 'Verifying…');
      const sb = await getSupabase();
      const { error } = await sb.auth.verifyOtp({ email, token, type: 'signup' });
      if (error) { busy(vf, false); return setMsg(vf, friendly(error)); }
      // verifyOtp signs the user straight in; sign back out so they complete a
      // deliberate login, as requested.
      await sb.auth.signOut();
      busy(vf, false);
      go('#/login/verified');
    });
    vf.querySelector('.js-resend')?.addEventListener('click', async () => {
      setMsg(vf, 'Sending a new code…', 'ok');
      const sb = await getSupabase();
      const { error } = await sb.auth.resend({ type: 'signup', email });
      setMsg(vf, error ? friendly(error) : 'A new code is on its way.', error ? 'err' : 'ok');
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

  /* --- forgot --- */
  const ff = document.querySelector('.js-forgot');
  if (ff) {
    ff.addEventListener('submit', async e => {
      e.preventDefault();
      const email = ((new FormData(ff).get('email')) || '').trim().toLowerCase();
      if (!email) return setMsg(ff, 'Enter your email address.');
      setMsg(ff, ''); busy(ff, true, 'Sending…');
      const sb = await getSupabase();
      await sb.auth.resetPasswordForEmail(email);
      busy(ff, false);
      // Always advance, even on error — never reveal whether an email is registered.
      go(`#/reset/${encodeURIComponent(email)}`);
    });
  }

  /* --- reset with OTP --- */
  // NB: `js-pwreset`, not `js-reset` — the latter is the "reset all progress" button.
  const rf = document.querySelector('.js-pwreset');
  if (rf) {
    wirePasswordUx(rf);
    rf.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(rf);
      const token = (fd.get('token') || '').trim();
      const password = fd.get('password') || '';
      const confirm = fd.get('confirm') || '';
      if (!/^\d{6}$/.test(token)) return setMsg(rf, 'Enter the 6-digit code from your email.');
      if (!passwordOk(password)) return setMsg(rf, 'Password too weak — use 8+ characters mixing capitals, small letters, a number or a symbol.');
      if (password !== confirm) return setMsg(rf, 'The two passwords do not match.');
      setMsg(rf, ''); busy(rf, true, 'Updating…');
      const sb = await getSupabase();
      const { error: vErr } = await sb.auth.verifyOtp({ email: rf.dataset.email, token, type: 'recovery' });
      if (vErr) { busy(rf, false); return setMsg(rf, friendly(vErr)); }
      const { error: uErr } = await sb.auth.updateUser({ password });
      if (uErr) { busy(rf, false); return setMsg(rf, friendly(uErr)); }
      await sb.auth.signOut();
      busy(rf, false);
      go('#/login/reset');
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
