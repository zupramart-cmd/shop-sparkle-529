// Minimal Service Worker — required for PWA install prompt
const CACHE_NAME = 'bitqraft-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass through all requests — no caching strategy needed
  event.respondWith(fetch(event.request));
});
