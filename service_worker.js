const version = "1.2.0";
const cacheName = `pokemon-store-${version}`;

console.log(`@@@@ run service_worker.js ${version}`);

self.addEventListener('install', (e) => {
    console.log(`@@@@ Service Worker install ${version}: handle install event`);

    async function initializeCache() {
        console.log(`@@@@ -- Service Worker initializeCache ${version}`);
        const cacheForThisVersion = await caches.open(cacheName);
        return cacheForThisVersion.addAll([
            '.',
            'index.html',
            'js/index.js',
        ]);
    }

    e.waitUntil(initializeCache());
});

self.addEventListener('activate', event => {
    console.log(`@@@@ Service Worker activate ${version}: all old clients are gone.`);
    console.log(`@@@@ -- Time to clean up old caches `);

    async function deleteOldCaches() {
        const keyList = await caches.keys();
        const arrayOfPromises = keyList.map(key => {
            if (!cacheName.includes(key)) {
                return caches.delete(key); //returns a Promise
            }
        });
        await Promise.all(arrayOfPromises);
        console.log(`@@@@ -- ${version} now ready to handle fetches!`);
    }

    event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (e) => {
    console.log(`@@@@ Service Worker ${version}: handle fetch event ${e.request.url}`);

    async function findResponseInCache() {
        const responseFromCache = await caches.match(e.request);
        return responseFromCache || fetch(e.request);
    }

    e.respondWith(findResponseInCache());
});
