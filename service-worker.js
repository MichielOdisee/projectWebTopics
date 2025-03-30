const CACHE_NAME = "parkwacht-cache-v1";
const urlsToCache = [
    "/projectWebTopics/",
    "/projectWebTopics/index.html",
    "/projectWebTopics/css/style.css",
    "/projectWebTopics/css/components.css",
    "/projectWebTopics/js/main.js",
    "/projectWebTopics/js/pwa.js",
    "/projectWebTopics/js/webworker.js",
    "/projectWebTopics/js/webmentions.js",
    "/projectWebTopics/manifest.json",
    "/projectWebTopics/images/parkwacht_schild_officieel.png",
    "/projectWebTopics/images/parkopruim.jpg",
    "/projectWebTopics/images/doop.jpg",
    "/projectWebTopics/images/icon-192x192.png",
    "/projectWebTopics/images/icon-512x512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
