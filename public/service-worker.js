console.log("Hello from your service worker!");

const FILES_TO_CACHE = [
    '/',
    './index.html',
    './facvicon.ico',
    './index.js',
    './style.css',
    './manifest.webmanifest',
    './icons/192x192.png',
    './icons/512x512.png'
];

const CACHE_NAME = 'static-cache-v2'
const DATA_CACHE_NAME = 'data-cache-v1'

// install using event.waitUntil()
// this method keeps service-worker in install phase until
// promise is resolved
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('files pre-cached successfully')
                return cache.addAll(FILES_TO_CACHE)
            })
    )
    self.skipWaiting()
});

