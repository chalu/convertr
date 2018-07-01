importScripts('./node_modules/idb/lib/idb.js');

const appPrefix = 'convertr-';
const staticCacheName = `${appPrefix}static-v3`;
const allCaches = [staticCacheName];

const getDB = () =>
  idb.open('convertr', 1, upgradeDb => {
    const countriesStore = upgradeDb.createObjectStore('countries', {
      keyPath: 'id'
    });
    countriesStore.createIndex('by-abbrv', 'alpha3');

    const conversionsStore = upgradeDb.createObjectStore('conversions', {
      keyPath: 'date'
    });
    conversionsStore.createIndex('by-date', 'date');
  });

const dbGetCountries = () =>
  getDB().then(db =>
    db
      .transaction('countries')
      .objectStore('countries')
      .index('by-abbrv')
      .getAll()
  );

const dbSaveCountries = data =>
  getDB().then(db => {
    const tnx = db.transaction('countries', 'readwrite');
    const store = tnx.objectStore('countries');
    data.forEach(country => {
      store.put(country);
    });
    return tnx.complete;
  });

const dbSaveConversion = conversion =>
  getDB().then(db => {
    const tnx = db.transaction('conversions', 'readwrite');
    const store = tnx.objectStore('conversions');
    store.put(conversion);
    return tnx.complete;
  });

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll([
        '/',
        'src/index.js',
        'statics/css/styles.css',
        'statics/images/icon.png',
        'node_modules/idb/lib/idb.js',
        'statics/images/didier-weemaels-36055-unsplash.jpg',
        'statics/images/didier-weemaels-36055-unsplash-grey.jpg',
        'node_modules/materialize-css/dist/css/materialize.min.css',
        'node_modules/materialize-css/dist/js/materialize.min.js',
        'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
        'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return (
              cacheName.startsWith('appPrefix') &&
              !allCaches.includes(cacheName)
            );
          })
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.pathname === '/api/v5/countries') {
    event.respondWith(serveCountries(event.request));
    return;
  }

  if (requestUrl.pathname.includes('v5/convert')) {
    event.respondWith(serveConversion(event.request));
    return;
  }

  // load static assets from cache
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// v5/convert

const serveConversion = request => {
  return fetch(request)
  .then((networkResponse) => {
    const clone = networkResponse.clone();
    if(clone.status === 200) {
      clone.json().then(data => {
        data.date = Date.now();
        console.log(data);
        dbSaveConversion(data);
      });      
    }
    return networkResponse;
  });
};

const serveCountries = request => {
  return fetch(request)
  .then((networkResponse) => {
    const clone = networkResponse.clone();
    if(clone.status === 200) {
      clone.json().then(data => {
        dbSaveCountries(Object.values(data.results));
      });      
    }
    return networkResponse;
  });
};

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
