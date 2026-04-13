const CACHE_NAME = 'poketower-v2';

// Archivos a cachear (mínimo necesario)
const ASSETS = [
  './',
  './index.html'
];

// INSTALACIÓN
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// ACTIVACIÓN (🔥 CLAVE PARA EVITAR BUGS)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH (🔥 NO CACHEA HTML DINÁMICO)
self.addEventListener('fetch', event => {
  // SOLO cachea recursos estáticos, no HTML dinámico
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});