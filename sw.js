/* Anglais pro : service worker (hors ligne + notifications) */
const CACHE = 'anglais-pro-v11';
const SHELL = ['./', 'index.html', 'style.css', 'app.js', 'core.js', 'quiz.js', 'config.js', 'content.js', 'toeic-data.js', 'partner.js', 'apprendre.js', 'oral.js', 'progress.js', 'toeic-ui.js', 'toeic7-data.js', 'toeic7.js', 'main.js', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
/* Réponse immédiate depuis le cache, mise à jour en arrière-plan */
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then((c) => c.match(req, { ignoreSearch: true }).then((hit) => {
    const net = fetch(req).then((res) => { if (res && res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  })));
});

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Anglais pro', {
    body: d.body || 'Votre session de 5 minutes vous attend.',
    icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag || 'anglais-pro-daily', data: { url: d.url || './' }
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cs) => {
    const url = new URL((e.notification.data && e.notification.data.url) || './', self.registration.scope).href;
    for (const c of cs) { if ('focus' in c) return c.focus().then((w) => { if (w && 'navigate' in w && true) return w.navigate(url); }); }
    return self.clients.openWindow(url);
  }));
});
