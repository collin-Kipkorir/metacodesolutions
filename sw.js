// sw.js
const cacheName = 'portfolio-cache-v1';
const assets = [
    '/',
    '/index.html',
    '/messages.html',
    '/css/styles.css',
    '/js/script.js',
    'https://your-firebase-url.com/firebase.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(assets);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                return cachedResponse || fetch(event.request);
            })
    );
});
