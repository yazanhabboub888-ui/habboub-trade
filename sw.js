const CACHE = 'econova-shell-v2';
const SHELL = ['./','./index.html','./manifest.webmanifest','./econova-icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Always prefer the network for HTML/navigation so stale black-screen markup cannot persist.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request, {cache:'no-store'}).catch(() => caches.match('./index.html')));
    return;
  }

  event.respondWith(
    fetch(request).then(response => {
      if (response.ok && ['style','script','image','font'].includes(request.destination)) {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, copy)).catch(()=>{});
      }
      return response;
    }).catch(() => caches.match(request))
  );
});
