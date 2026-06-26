// High-performance, production-ready Service Worker for Barsha AI
const CACHE_NAME = 'barsha-pwa-cache-v4';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[Service Worker] Pre-caching warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Message listener to trigger manual updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Smart Fetch Router
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Strictly bypass service worker for API routes and non-HTTP schemes
  if (!event.request.url.startsWith('http') || url.pathname.startsWith('/api/')) {
    return; // Let the browser handle normally
  }

  // 2. ONLY cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // 3. Document routing (index.html, root, main pages) -> Network-First
  const isDoc = event.request.mode === 'navigate' || 
                url.pathname === '/' || 
                url.pathname.endsWith('.html');

  if (isDoc) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Fallback to /index.html if we don't have this specific page cached
            return caches.match('/index.html');
          });
        })
    );
    return;
  }

  // 4. Static assets (JS, CSS, SVGs, etc.) -> Network-First falling back to Cache
  // This avoids any broken hashed file issues (e.g. index-ABC.js -> index-XYZ.js on redeploy)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If completely offline and asset not found, return empty response or let it fail gracefully
          return new Response('', { status: 404, statusText: 'Not found offline' });
        });
      })
  );
});
