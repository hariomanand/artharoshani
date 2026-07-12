// Cloud-sync layer. Offline-first: the app renders instantly from bundled
// data, then (if cloud is configured & online) patches in admin edits and
// uploaded media, and re-renders. Fully degrades to offline with no errors.
import { getSupabase, CLOUD_ENABLED } from './supabase.js';
import { CLASSES, findChapter } from '../data/index.js';
import { LABS } from '../data/labs.js';

// Extra media (PPTs / infographics / PDFs) attached by admin, keyed by chapterId.
export const extraMedia = {};   // chapterId -> [{title, type, url}]
export const announcements = []; // [{title, body, date}]

export async function syncFromCloud(onDone) {
  if (!CLOUD_ENABLED) return;
  const sb = await getSupabase();
  if (!sb) return;
  try {
    // 1) Content overrides — admin-edited chapter fields (title/lead/lessons JSON).
    const { data: overrides } = await sb.from('content').select('*').eq('published', true);
    (overrides || []).forEach(row => {
      const found = findChapter(row.class_id, row.chapter_id);
      if (!found) return;
      if (row.title) found.ch.title = row.title;
      if (row.lead) found.ch.lead = row.lead;
      if (row.summary) found.ch.summary = row.summary;
      if (Array.isArray(row.lessons) && row.lessons.length) { found.ch.lessons = row.lessons; found.ch.status = 'ready'; }
      if (Array.isArray(row.questions) && row.questions.length) found.ch.questions = row.questions;
    });

    // 2) Media (PPT / infographics / PDF) uploaded to Storage, linked to a chapter.
    const { data: media } = await sb.from('media').select('*').order('created_at', { ascending: false });
    (media || []).forEach(m => {
      (extraMedia[m.chapter_id] ||= []).push({ title: m.title, type: m.kind, url: m.url });
    });

    // 3) Lab overrides (admin can add/adjust labs).
    const { data: labs } = await sb.from('labs').select('*').eq('published', true);
    (labs || []).forEach(row => {
      const existing = LABS.find(l => l.id === row.slug);
      if (existing) Object.assign(existing, { title: row.title, tagline: row.tagline, about: row.about });
    });

    // 4) Announcements banner.
    const { data: ann } = await sb.from('announcements').select('*').order('created_at', { ascending: false }).limit(3);
    (ann || []).forEach(a => announcements.push({ title: a.title, body: a.body, date: a.created_at }));

    onDone && onDone();
  } catch (err) {
    console.warn('Cloud sync skipped:', err.message);
  }
}
