// ArthaRoshni service worker — cache-first, offline-ready. No backend needed.
const CACHE = 'arthapath-v16';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './css/site.css',
  './css/blueprint.css',
  './css/auth.css',
  './manifest.webmanifest',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/india-blueprint.jpg',
  './js/app.js',
  './js/auth.js',
  './js/reviews.js',
  './js/config.js',
  './js/icons.js',
  './js/blueprint.js',
  './data/blueprint.js',
  './js/blocks.js',
  './js/store.js',
  './js/mcq.js',
  './js/labs.js',
  './js/supabase.js',
  './js/content.js',
  './data/index.js',
  './data/class10.js',
  './data/class11.js',
  './data/class12.js',
  './data/qbank.js',
  './data/labs.js',
  './data/catalogue.js',
  './data/site.js',
  './data/blog.js',
];

self.addEventListener('install', e => {
  // Tolerant precache — a single missing file must not abort the install.
  e.waitUntil(caches.open(CACHE).then(c =>
    Promise.all(ASSETS.map(a => c.add(a).catch(() => {})))
  ).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Never intercept cross-origin (Supabase API, CDN) — let them go straight to network.
  if (url.origin !== location.origin) return;

  // Network-first for app shell/content so updates appear immediately;
  // fall back to cache when offline.
  e.respondWith(
    fetch(request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(request).then(c => c || caches.match('./index.html')))
  );
});
