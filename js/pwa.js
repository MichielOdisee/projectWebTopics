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
