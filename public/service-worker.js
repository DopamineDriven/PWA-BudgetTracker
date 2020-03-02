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
    // wait until cache is opened
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                // then pre-cache all files to cache
                console.log('files pre-cached successfully')
                return cache.addAll(FILES_TO_CACHE)
            })
    )
    self.skipWaiting()
});


// event listener for activation
self.addEventListener('activate', event => {
    // wait until keys retrieved from cache
    event.waitUntil(
        caches.keys()
            // caches is an obj containing all caches
            // keys() method retrieves all keys
            .then(keyList => {
                // list of keys passed in, returning a promise array
                return Promise.all(
                    // build new array by modifying each element in key list
                    keyList.map(key => {
                        // current iteration of keylist passed in
                        // checks if key is not equal to cache names
                        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                            console.log(`removing old cache data ${key}`)
                            // if data !== names, delete old name
                            return caches.delete(key)
                        }
                    })
                )

            })
    )
    self.clients.claim()
});