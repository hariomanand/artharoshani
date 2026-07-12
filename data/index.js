import class10 from './class10.js';
import class11 from './class11.js';
import class12 from './class12.js';

export const CLASSES = [class10, class11, class12];

// Flat lookup maps for fast routing + search
export const byClass = Object.fromEntries(CLASSES.map(c => [c.id, c]));

export function findChapter(classId, chapterId) {
  const cls = byClass[classId];
  if (!cls) return null;
  for (const sub of cls.subjects) {
    const ch = sub.chapters.find(c => c.id === chapterId);
    if (ch) return { cls, sub, ch };
  }
  return null;
}

export function allReadyChapters() {
  const out = [];
  for (const cls of CLASSES)
    for (const sub of cls.subjects)
      for (const ch of sub.chapters)
        if (ch.status === 'ready') out.push({ cls, sub, ch });
  return out;
}

export function stats() {
  let chapters = 0, ready = 0, questions = 0;
  for (const cls of CLASSES)
    for (const sub of cls.subjects)
      for (const ch of sub.chapters) {
        chapters++;
        if (ch.status === 'ready') ready++;
        questions += (ch.questions || []).length;
      }
  return { chapters, ready, questions, classes: CLASSES.length };
}
