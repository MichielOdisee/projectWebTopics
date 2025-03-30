const CACHE_NAME = "parkwacht-v1";
const OFFLINE_URLS = [
    "/",
    "/index.html",
    "/css/style.css",
    "/css/components.css",
    "/js/main.js",
    "/js/webmentions.js",
    "/js/pwa.js",
    "/images/parkwacht_schild_officieel.png",
    "/images/parkopruim.jpg",
    "/images/doop.jpg",
    "/manifest.json",
    "/feed.xml"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(OFFLINE_URLS);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            return cached || fetch(event.request).catch(() => {
                // optioneel: je kunt hier een fallback-pagina tonen als je die hebt
                if (event.request.destination === "document") {
                    return caches.match("/index.html");
                }
            });
        })
    );
});
