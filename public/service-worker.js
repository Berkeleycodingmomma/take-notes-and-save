const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/notes.html",
    "/manifest.webmanifest",
    "./assets/css/styles.css",
    "/assets/js/index.js",
];

const CACHE_NAME = "static-cache-v2";

const DATA_CACHE_NAME = "data-cache-v1";

// the service worker is installed
self.addEventListener("install", function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Your files were pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    // current service worker will stop and wait, sw will take over instead of asking page to refresh
    self.skipWaiting();
});

// event is fired off and activated 
self.addEventListener("activate", function (evt) {

    evt.waitUntil(
        caches.keys().then(keyList => {
            // returning a promise 
            return Promise.all(
                // mapping over all of the keys from the cache
                keyList.map(key => {
                    // if the key does not match the current CACHE_NAME and the DATA_CACHE_NAME
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    //Below, once service worker has been activated, it will take control of any pages
    self.clients.claim();
});

// the service worker tries to fetch a resource
self.addEventListener("fetch", function (evt) {

    if (evt.request.url.includes("/api/")) {
        evt.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(evt.request)
                    .then(response => {
                        // If the response was good, clone it and store it in the cache.
                        if (response.status === 200) {
                            cache.put(evt.request.url, response.clone());
                        }

                        // return the response into the cache
                        return response;
                    })

                    .catch(err => {

                        return cache.match(evt.request);

                    });

                // if an error was thrown opening the cache, or at any other point
            }).catch(err => {

                console.log(err)
            })
        );

        return;
    }

    // if the request did not contain "api" in the URL, check the static cache
    evt.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request);
            });
        })
    );
});