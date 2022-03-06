const version = "1.7.7";
const cacheName = `pokemon-store-${version}`;

console.log(`@@@@ run service_worker.js ${version}`);

async function initializeCache() {
    const doesCacheExist = await caches.has(cacheName);
    if (doesCacheExist) return;

    console.log(`@@@@ -- Service Worker initializeCache ${version}`);
    const cacheForThisVersion = await caches.open(cacheName);
    return cacheForThisVersion.addAll([
        '.',
        'index.html',
        'js/index.js',
        'manifest.webmanifest',
        'css/bootstrap.min.css',
        'css/normalize.css',
        'css/style.css',
        'icon/113.png',
        'images/113.png',
        'images/202.png',
        'images/289.png',
        'images/376.png',
        'images/862.png',
    ]);
}

function skip_waiting() {
    self.skipWaiting().then(r => {
        if (r) {
            console.log("skipped waiting")
        }
    });
}

self.addEventListener('message', (event) => {
    if (event.data.command === "REQUEST_VERSION") {
        console.log("### received a request_version command")
        event.source.postMessage({command: "RESPONSE_VERSION", payload: version});
    } else if (event.data.command === "SKIP_WAITING") {
        console.log("### received a skipWaiting command")
        skip_waiting();
    } else console.log("@@@ unknown message")
})


self.addEventListener('install', (e) => {
    console.log(`@@@@ Service Worker install ${version}: handle install event`);
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
        await initializeCache()
        const responseFromCache = await caches.match(e.request);
        return responseFromCache || fetch(e.request);
    }

    e.respondWith(findResponseInCache());
});
