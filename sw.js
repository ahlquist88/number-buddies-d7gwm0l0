/* Number Buddies offline helper, version 8cbec2223244 (made by build_site.py) */
const CACHE = 'nb-8cbec2223244';
const FILES = ["./", "./index.html", "./privacy.html", "./manifest.webmanifest", "./fonts/andika-400-latin-ext.woff2", "./fonts/andika-400-latin.woff2", "./fonts/andika-700-latin-ext.woff2", "./fonts/andika-700-latin.woff2", "./fonts/fredoka-latin-ext.woff2", "./fonts/fredoka-latin.woff2", "./icons/apple-touch-icon.png", "./icons/favicon-32.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png"];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys()
  .then(keys => Promise.all(keys.filter(k => k.startsWith('nb-') && k !== CACHE).map(k => caches.delete(k))))
  .then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate' && url.origin === location.origin) {
    e.respondWith(fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('./'))));
    return;
  }
  // the app's own files, and the fixed version of Firebase's code, are kept after the first visit
  if (url.origin === location.origin || (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/'))) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })));
  }
});
