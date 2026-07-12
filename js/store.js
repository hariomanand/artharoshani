// Local persistence — progress, bookmarks, quiz scores. No backend, no cost.
const KEY = 'arthapath.v1';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}
function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

let state = load();
if (!state.read) state.read = {};       // chapterId -> true
if (!state.bookmarks) state.bookmarks = {}; // chapterId -> true
if (!state.scores) state.scores = {};    // chapterId -> {best, last, total}

export const Store = {
  isRead: id => !!state.read[id],
  markRead(id) { state.read[id] = true; save(state); },
  toggleRead(id) { state.read[id] ? delete state.read[id] : state.read[id] = true; save(state); return !!state.read[id]; },

  isBookmarked: id => !!state.bookmarks[id],
  toggleBookmark(id) { state.bookmarks[id] ? delete state.bookmarks[id] : state.bookmarks[id] = true; save(state); return !!state.bookmarks[id]; },
  bookmarks: () => Object.keys(state.bookmarks),

  saveScore(id, score, total) {
    const prev = state.scores[id] || { best: 0 };
    state.scores[id] = { best: Math.max(prev.best || 0, score), last: score, total };
    save(state);
  },
  score: id => state.scores[id],

  progress() {
    const readIds = Object.keys(state.read);
    return { readCount: readIds.length, readIds };
  },
  reset() { state = { read: {}, bookmarks: {}, scores: {} }; save(state); },
};
