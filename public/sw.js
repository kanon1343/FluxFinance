const CACHE_NAME = "fluxfinance-v1";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/_next/static/css/",
  "/_next/static/js/",
];

const API_CACHE_NAME = "fluxfinance-api-v1";
const API_URLS = ["/api/market", "/api/history"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }),
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with stale-while-revalidate strategy
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);

        // Fetch from network
        const networkPromise = fetch(request)
          .then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // Return cached response if network fails
            return cachedResponse;
          });

        // Return cached response immediately if available, otherwise wait for network
        return cachedResponse || networkPromise;
      }),
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image"
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        return (
          response ||
          fetch(request).then((response) => {
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
        );
      }),
    );
    return;
  }

  // Handle navigation requests with network-first strategy
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match("/");
      }),
    );
    return;
  }
});
