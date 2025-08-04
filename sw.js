// Simple service worker for caching static assets
const CACHE_NAME = 'kalkulator-v1';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Static assets to cache
const STATIC_ASSETS = [
  '/assets/css/style.min.css',
  '/assets/js/main.min.js',
  '/assets/js/search-data.js',
  '/assets/img/logo.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Don't cache analytics or external requests
  if (event.request.url.includes('google-analytics.com') ||
      event.request.url.includes('googletagmanager.com') ||
      event.request.url.includes('googlesyndication.com') ||
      event.request.url.includes('doubleclick.net')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();

            // Cache static assets and HTML pages
            if (event.request.url.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/i) ||
                event.request.url.match(/\/(calculators|en\/calculators)\//)) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            // Return a basic offline page for HTML requests if available
            if (event.request.headers.get('accept').includes('text/html')) {
              return new Response(
                '<h1>Офлайн</h1><p>Немає підключення до інтернету. Спробуйте пізніше.</p>',
                { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
              );
            }
          });
      })
  );
});