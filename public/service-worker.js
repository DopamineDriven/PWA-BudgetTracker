console.log("Hello from your service worker!");

const FILES_TO_CACHE = [
    '/',
    './index.html',
    './index.js',
    './style.css',
    './manifest.webmanifest',
    './icons/192x192.png',
    './icons/512x512.png'
];

const CACHE_NAME = 'static-cache-v2'
const DATA_CACHE_NAME = 'data-cache-v1'