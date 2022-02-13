console.log("run index.js");

// Register service worker to control making site work offline
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        console.log("start registering Service Worker");
        const serviceWorkerRegistration = await navigator.serviceWorker.register('service_worker.js');
        console.log('registration Service Worker done');
    } else {
        console.log("geen Service Worker mogelijk in deze browser");
    }
}
registerServiceWorker();
