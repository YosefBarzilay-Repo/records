self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("v1").then(cache => {
      // Cache files one by one to identify which ones fail
      const urlsToCache = [
        "./", // Use relative path
        "./index.html",
        "./new-record.html",
        "./settings.html",
        "./manifest.json",
        "./icons/icon-192.png",
        "./icons/icon-512.png"
      ];
      
      // Add each URL individually with error handling
      return Promise.all(
        urlsToCache.map(url => {
          return cache.add(url).catch(err => {
            console.warn(`Failed to cache: ${url}`, err);
            // Continue even if one file fails
          });
        })
      );
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(err => {
      console.error("Fetch failed:", err);
      // Return a fallback response or throw the error
      throw err;
    })
  );
});