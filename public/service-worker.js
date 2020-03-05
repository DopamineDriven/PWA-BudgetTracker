console.log("Hello from your service worker!");

const FILES_TO_CACHE = [
    '/',
    './index.html',
    './favicon.ico',
    './index.js',
    './style.css',
    './manifest.webmanifest',
    './icons/192x192.png',
    './icons/icon-512x512.png',
    './db.js',
    'https://cdn.jsdelivr.net/npm/chart.js@2.8.0',
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff?v=4.7.0',
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0'
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

// event listener for fetching
self.addEventListener('fetch', event => {
    // if fetch being executed contains /api, then...
    if (event.request.url.includes('/api')) {
        console.log(`[Service Worker] Fetch (data) ${event.request.url}`)
        // respond with the following
        event.respondWith(
            // open cache specified, then...
            caches.open(DATA_CACHE_NAME)
                .then(cache => {
                    // pass in opened cache, return request of fetch call being made
                    return fetch(event.request)
                        .then(response => {
                            // if the response is okay (200), then...
                            if (response.status === 200) {
                                // clone response into cache and save url used to call fetch
                                // this allows for replication of fetch event when offline
                                cache.put(event.request.url, response.clone())
                            }
                            // return response
                            return response
                        })
                        // if error then attempt to get fetch from cache if it exists
                        .catch(error => {
                            console.log(error)
                            return cache.match(event.request)
                        }) 
                })
        )
        return
    }
    // else, if fetch does not contain /api, then...
    event.respondWith(
        // caches contains all caches, use open to get specified cache via CACHE_NAME
        caches.open(CACHE_NAME)
            .then(cache => {
                // using cache returned, return match within cache of request being fetched
                return cache.match(event.request)
                    .then(response => {
                        // return if response exists; else, make a fetch with the request
                        return response || fetch(event.response)
                    })
            })
    )
});