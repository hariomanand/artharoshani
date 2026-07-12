// ArthaRoshni Admin — content, media (PPT/infographics), labs, users, announcements.
// All operations go through Supabase with Row Level Security. If Supabase isn't
// configured yet, a setup notice is shown instead.
import { getSupabase, CLOUD_ENABLED } from './supabase.js';
import { STORAGE_BUCKET } from './config.js';
import { CLASSES } from '../data/index.js';
import { LABS } from '../data/labs.js';

const root = document.getElementById('admin');
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let sb = null, user = null, tab = 'dash';

/* chapter options for dropdowns */
function chapterOptions() {
  return CLASSES.flatMap(c => c.subjects.flatMap(su => su.chapters.map(ch =>
    `<option value="${c.id}::${ch.id}">${esc(c.title)} — Ch ${ch.number}: ${esc(ch.title)}</option>`))).join('');
}

function toast(msg, kind = '') {
  const t = document.createElement('div');
  t.className = `toast ${kind}`; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2600);
}

/* ------------------------------------------------ boot */
async function boot() {
  if (!CLOUD_ENABLED) return renderSetupNotice();
  sb = await getSupabase();
  if (!sb) return renderSetupNotice();
  const { data } = await sb.auth.getSession();
  if (data.session) { user = data.session.user; return renderShell(); }
  renderLogin();
}

/* ------------------------------------------------ setup notice */
function renderSetupNotice() {
  root.innerHTML = `<div class="adm-login"><div class="adm-card">
    <div class="adm-top" style="border:none;padding:0 0 14px"><div class="logo">⚙️</div><h1>Admin setup</h1></div>
    <div class="notice"><b>Cloud not connected yet</b>
      Open <span class="code-inline">js/config.js</span> and paste your Supabase URL and anon key. See <span class="code-inline">DEPLOYMENT.md</span> for the 5-minute setup.</div>
    <p class="muted" style="font-size:13px">Until then the public app still works fully offline — only the admin panel and cloud sync need Supabase.</p>
  </div></div>`;
}

/* ------------------------------------------------ login */
function renderLogin() {
  root.innerHTML = `<div class="adm-login"><div class="adm-card">
    <div class="adm-top" style="border:none;padding:0 0 16px"><div class="logo">₹</div><h1>ArthaRoshni Admin</h1></div>
    <div class="field"><label>Email</label><input id="em" type="email" placeholder="you@example.com"></div>
    <div class="field"><label>Password</label><input id="pw" type="password" placeholder="••••••••"></div>
    <button class="btn js-login">🔑 Sign in</button>
    <p class="muted" style="font-size:12px;margin-top:14px;text-align:center">Admin accounts are created in the Supabase dashboard (Authentication → Users), then given the <span class="code-inline">admin</span> role.</p>
  </div></div>`;
  root.querySelector('.js-login').addEventListener('click', async () => {
    const email = root.querySelector('#em').value.trim();
    const password = root.querySelector('#pw').value;
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return toast(error.message, 'err');
    user = data.user; renderShell();
  });
}

/* ------------------------------------------------ shell */
async function renderShell() {
  // role check via profiles table
  const { data: prof } = await sb.from('profiles').select('role,full_name').eq('id', user.id).single();
  const role = prof?.role || 'user';
  if (role !== 'admin') {
    root.innerHTML = `<div class="adm-login"><div class="adm-card">
      <div class="notice"><b>Not an admin</b>This account (${esc(user.email)}) doesn’t have the admin role. In Supabase → Table editor → profiles, set <span class="code-inline">role = 'admin'</span> for this user.</div>
      <button class="btn btn--ghost js-out">Sign out</button></div></div>`;
    root.querySelector('.js-out').addEventListener('click', signOut);
    return;
  }

  const tabs = [['dash', '📊 Dashboard'], ['content', '📝 Notes'], ['media', '📎 Media/PPT'], ['labs', '🔬 Labs'], ['users', '👥 Users'], ['ann', '📢 Announce']];
  root.innerHTML = `<div class="adm-shell">
    <div class="adm-top"><div class="logo">₹</div><h1>ArthaRoshni Admin</h1>
      <div class="who">${esc(prof?.full_name || user.email)} <button class="js-out">Sign out</button></div></div>
    <div class="adm-tabs">${tabs.map(([k, l]) => `<button data-tab="${k}" class="${tab === k ? 'active' : ''}">${l}</button>`).join('')}</div>
    <div class="adm-main" id="pane"></div>
  </div>`;
  root.querySelector('.js-out').addEventListener('click', signOut);
  root.querySelectorAll('.adm-tabs button').forEach(b => b.addEventListener('click', () => { tab = b.dataset.tab; renderShell(); }));
  renderPane();
}

async function signOut() { await sb.auth.signOut(); user = null; renderLogin(); }

/* ------------------------------------------------ panes */
async function renderPane() {
  const pane = document.getElementById('pane');
  if (tab === 'dash') return renderDash(pane);
  if (tab === 'content') return renderContent(pane);
  if (tab === 'media') return renderMediaTab(pane);
  if (tab === 'labs') return renderLabsTab(pane);
  if (tab === 'users') return renderUsers(pane);
  if (tab === 'ann') return renderAnn(pane);
}

async function count(table) { try { const { count } = await sb.from(table).select('*', { count: 'exact', head: true }); return count ?? 0; } catch { return 0; } }

async function renderDash(pane) {
  pane.innerHTML = `<div class="adm-card"><h2>Overview</h2><p class="sub">Live counts from your Supabase project.</p>
    <div class="grid2" id="stats"><div class="dash-stat"><b>…</b><span>loading</span></div></div></div>
    <div class="adm-card"><h2>Quick actions</h2>
    <div class="grid2"><button class="btn js-go" data-t="content">📝 Edit notes</button>
    <button class="btn btn--accent js-go" data-t="media">📎 Upload PPT / infographic</button></div></div>`;
  const [c, m, l, u] = await Promise.all([count('content'), count('media'), count('labs'), count('profiles')]);
  pane.querySelector('#stats').innerHTML = [['Content edits', c], ['Media files', m], ['Labs', l], ['Users', u]]
    .map(([k, v]) => `<div class="dash-stat"><b>${v}</b><span>${k}</span></div>`).join('');
  pane.querySelectorAll('.js-go').forEach(b => b.addEventListener('click', () => { tab = b.dataset.t; renderShell(); }));
}

/* --- Notes / content editor --- */
function renderContent(pane) {
  pane.innerHTML = `<div class="adm-card">
    <h2>Edit chapter notes</h2><p class="sub">Overrides publish instantly to the app. Leave a field blank to keep the built-in content.</p>
    <div class="field"><label>Chapter</label><select id="ch">${chapterOptions()}</select></div>
    <div class="field"><label>Title (optional)</label><input id="t" placeholder="Override chapter title"></div>
    <div class="field"><label>Intro / lead (optional)</label><textarea id="lead" rows="2"></textarea></div>
    <div class="field"><label>Lessons JSON (optional — full lessons array)</label>
      <textarea id="lessons" rows="8" placeholder='[{"id":"l1","title":"Lesson 1","blocks":[{"type":"p","text":"..."}]}]'></textarea></div>
    <div class="field"><label>Questions JSON (optional)</label>
      <textarea id="questions" rows="5" placeholder='[{"q":"...","options":["a","b","c","d"],"answer":0,"source":"pyq","year":2023,"explain":"..."}]'></textarea></div>
    <button class="btn js-save">💾 Publish</button>
  </div>
  <div class="adm-card"><h2>Block types reference</h2><p class="sub">Use these <span class="code-inline">type</span> values inside a lesson’s blocks:</p>
    <p style="font-size:13px;line-height:1.9">
    <span class="code-inline">p</span> paragraph · <span class="code-inline">h</span> subheading ·
    <span class="code-inline">list</span> {items:[]} · <span class="code-inline">callout</span> {variant:def|tip|warn|exam} ·
    <span class="code-inline">formula</span> {tex,note} · <span class="code-inline">table</span> {headers,rows} ·
    <span class="code-inline">flow</span> {steps:[{title,text}]} · <span class="code-inline">figure</span> {svg,caption} ·
    <span class="code-inline">terms</span> {items:[{term,def}]}</p></div>`;

  pane.querySelector('.js-save').addEventListener('click', async () => {
    const [class_id, chapter_id] = pane.querySelector('#ch').value.split('::');
    const row = { class_id, chapter_id, published: true, updated_by: user.id };
    const t = pane.querySelector('#t').value.trim(); if (t) row.title = t;
    const lead = pane.querySelector('#lead').value.trim(); if (lead) row.lead = lead;
    try {
      const les = pane.querySelector('#lessons').value.trim(); if (les) row.lessons = JSON.parse(les);
      const q = pane.querySelector('#questions').value.trim(); if (q) row.questions = JSON.parse(q);
    } catch (e) { return toast('Invalid JSON: ' + e.message, 'err'); }
    const { error } = await sb.from('content').upsert(row, { onConflict: 'class_id,chapter_id' });
    error ? toast(error.message, 'err') : toast('Published ✓', 'ok');
  });
}

/* --- Media upload (PPT / infographics / PDF / notes) --- */
function renderMediaTab(pane) {
  pane.innerHTML = `<div class="adm-card">
    <h2>Upload media</h2><p class="sub">PPT, PDF, infographic images or notes — stored in Supabase Storage and shown on the chapter page.</p>
    <div class="field"><label>Attach to chapter</label><select id="ch">${chapterOptions()}</select></div>
    <div class="field row"><div><label>Title</label><input id="t" placeholder="e.g. Chapter 1 Slides"></div>
      <div><label>Type</label><select id="kind"><option value="ppt">PPT / Slides</option><option value="pdf">PDF</option><option value="infographic">Infographic</option><option value="notes">Notes</option></select></div></div>
    <div class="field"><label>File</label><input id="file" type="file"></div>
    <button class="btn js-up">⬆️ Upload</button>
  </div>
  <div class="adm-card"><h2>Uploaded files</h2><div id="list" class="mt">Loading…</div></div>`;

  pane.querySelector('.js-up').addEventListener('click', async () => {
    const file = pane.querySelector('#file').files[0];
    if (!file) return toast('Choose a file first', 'err');
    const [class_id, chapter_id] = pane.querySelector('#ch').value.split('::');
    const path = `${chapter_id}/${Date.now()}_${file.name.replace(/[^\w.\-]/g, '_')}`;
    const up = await sb.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: false });
    if (up.error) return toast(up.error.message, 'err');
    const { data: pub } = sb.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    const { error } = await sb.from('media').insert({
      class_id, chapter_id, title: pane.querySelector('#t').value.trim() || file.name,
      kind: pane.querySelector('#kind').value, url: pub.publicUrl, path, uploaded_by: user.id,
    });
    error ? toast(error.message, 'err') : (toast('Uploaded ✓', 'ok'), loadMedia(pane));
  });
  loadMedia(pane);
}
async function loadMedia(pane) {
  const { data } = await sb.from('media').select('*').order('created_at', { ascending: false });
  const box = pane.querySelector('#list');
  box.innerHTML = (data || []).length ? data.map(m => `<div class="list-row">
    <div class="main"><b>${esc(m.title)}</b><span>${esc(m.kind)} · ${esc(m.chapter_id)}</span></div>
    <a class="chip" href="${m.url}" target="_blank" rel="noopener">Open</a>
    <button class="chip js-del" data-id="${m.id}" data-path="${esc(m.path)}" style="color:var(--danger)">Delete</button>
  </div>`).join('') : '<p class="muted">No files yet.</p>';
  box.querySelectorAll('.js-del').forEach(b => b.addEventListener('click', async () => {
    await sb.storage.from(STORAGE_BUCKET).remove([b.dataset.path]).catch(() => {});
    await sb.from('media').delete().eq('id', b.dataset.id);
    toast('Deleted', 'ok'); loadMedia(pane);
  }));
}

/* --- Labs editor --- */
function renderLabsTab(pane) {
  pane.innerHTML = `<div class="adm-card"><h2>Manage labs</h2><p class="sub">Edit the title, tagline and description of a lab. New interactive tools are added in code.</p>
    <div class="field"><label>Lab</label><select id="lab">${LABS.map(l => `<option value="${l.id}">${esc(l.title)}</option>`).join('')}</select></div>
    <div class="field"><label>Title</label><input id="t"></div>
    <div class="field"><label>Tagline</label><input id="tag"></div>
    <div class="field"><label>About</label><textarea id="ab" rows="4"></textarea></div>
    <button class="btn js-save">💾 Publish lab</button></div>`;
  const sel = pane.querySelector('#lab');
  const fill = () => { const l = LABS.find(x => x.id === sel.value); pane.querySelector('#t').value = l.title; pane.querySelector('#tag').value = l.tagline; pane.querySelector('#ab').value = l.about; };
  sel.addEventListener('change', fill); fill();
  pane.querySelector('.js-save').addEventListener('click', async () => {
    const { error } = await sb.from('labs').upsert({
      slug: sel.value, title: pane.querySelector('#t').value, tagline: pane.querySelector('#tag').value,
      about: pane.querySelector('#ab').value, published: true,
    }, { onConflict: 'slug' });
    error ? toast(error.message, 'err') : toast('Lab published ✓', 'ok');
  });
}

/* --- Users --- */
async function renderUsers(pane) {
  pane.innerHTML = `<div class="adm-card"><h2>User management</h2><p class="sub">Promote or demote users. New sign-ups appear here automatically.</p><div id="list">Loading…</div></div>`;
  const { data, error } = await sb.from('profiles').select('*').order('created_at', { ascending: false });
  const box = pane.querySelector('#list');
  if (error) { box.innerHTML = `<p class="muted">${esc(error.message)}</p>`; return; }
  box.innerHTML = (data || []).map(p => `<div class="list-row">
    <div class="main"><b>${esc(p.full_name || p.email || p.id.slice(0, 8))}</b><span>${esc(p.email || '')}</span></div>
    <span class="role ${p.role === 'admin' ? 'admin' : ''}">${esc(p.role || 'user')}</span>
    <button class="chip js-role" data-id="${p.id}" data-role="${p.role === 'admin' ? 'user' : 'admin'}">${p.role === 'admin' ? 'Make user' : 'Make admin'}</button>
  </div>`).join('') || '<p class="muted">No users yet.</p>';
  box.querySelectorAll('.js-role').forEach(b => b.addEventListener('click', async () => {
    const { error } = await sb.from('profiles').update({ role: b.dataset.role }).eq('id', b.dataset.id);
    error ? toast(error.message, 'err') : (toast('Role updated ✓', 'ok'), renderUsers(pane));
  }));
}

/* --- Announcements --- */
function renderAnn(pane) {
  pane.innerHTML = `<div class="adm-card"><h2>New announcement</h2><p class="sub">Shows as a banner in the app.</p>
    <div class="field"><label>Title</label><input id="t"></div>
    <div class="field"><label>Message</label><textarea id="b" rows="3"></textarea></div>
    <button class="btn js-post">📢 Post</button></div>
    <div class="adm-card"><h2>Recent</h2><div id="list">Loading…</div></div>`;
  pane.querySelector('.js-post').addEventListener('click', async () => {
    const { error } = await sb.from('announcements').insert({ title: pane.querySelector('#t').value, body: pane.querySelector('#b').value, created_by: user.id });
    error ? toast(error.message, 'err') : (toast('Posted ✓', 'ok'), loadAnn(pane));
  });
  loadAnn(pane);
}
async function loadAnn(pane) {
  const { data } = await sb.from('announcements').select('*').order('created_at', { ascending: false }).limit(10);
  pane.querySelector('#list').innerHTML = (data || []).map(a => `<div class="list-row"><div class="main"><b>${esc(a.title)}</b><span>${esc(a.body || '')}</span></div></div>`).join('') || '<p class="muted">None yet.</p>';
}

boot();
