self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('parkwacht-cache').then(cache =>
            cache.addAll([
                '/',
                '/index.html',
                '/css/style.css',
                '/css/components.css',
                '/images/parkopruim.jpg',
                '/images/parkwacht_schild_officieel.png',
                '/images/doop.jpg'
            ])
        )
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/projectWebTopics/service-worker.js')
            .then(reg => console.log("✅ Service worker geregistreerd:", reg))
            .catch(err => console.error("❌ Fout bij registratie:", err));
    });
}
