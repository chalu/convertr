importScripts('./node_modules/idb/lib/idb.js');

const appPrefix = 'convertr-';
const staticCacheName = `${appPrefix}static-v1`;
const allCaches = [staticCacheName];
const logstyle = 'background:#26a69a; color: #fff; display: block;';

// IndexedDB onperations
// open/get connection to database
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

// get Countries data from DB
const dbGetCountries = () =>
  getDB().then(db =>
    db
      .transaction('countries')
      .objectStore('countries')
      .index('by-abbrv')
      .getAll()
  );

// save Countries data to DB
const dbSaveCountries = data =>
  getDB().then(db => {
    const tnx = db.transaction('countries', 'readwrite');
    const store = tnx.objectStore('countries');
    data.forEach(country => {
      store.put(country);
    });
    return tnx.complete;
  });

// get currency conversions data from DB
const dbGetConversions = () => {
  return getDB().then(db => {
    return db
      .transaction('conversions')
      .objectStore('conversions')
      .index('by-date')
      .getAll();
  });
};

// save currency conversions data for today to DB
const dbSaveConversions = conversions =>
  getDB().then(db => {
    const tnx = db.transaction('conversions', 'readwrite');
    const store = tnx.objectStore('conversions');
    conversions.forEach(conversion => store.put(conversion));
    return tnx.complete;
  });

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll([
        '/convertr/',
        '/convertr/dist/main.js',
        '/convertr/statics/images/icon.png',
        '/convertr/node_modules/idb/lib/idb.js',
        '/convertr/statics/images/optimized/didier-weemaels-36055-unsplash.jpg',
        '/convertr/statics/images/optimized/didier-weemaels-36055-unsplash-grey.jpg',
        '/convertr/node_modules/materialize-css/dist/css/materialize.min.css',
        '/convertr/node_modules/materialize-css/dist/js/materialize.min.js',
        'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
        'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
      ]);
    })
  );
});

// TODO delete conversions in DB older then 1 week
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

  // API call for countries data
  if (requestUrl.pathname === '/api/v5/countries') {
    event.respondWith(serveCountries(event));
    return;
  }

  // API call to convert between two or more curencies
  if (requestUrl.pathname.includes('/api/v5/convert')) {
    event.respondWith(serveConversion(event, requestUrl.search));
    return;
  }

  // load static assets from cache
  event.respondWith(
    caches
      .match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// respond to user with cached data
const generateAResponse = data => {
  return new Response(JSON.stringify(data), {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// given a timestamp, generate
// today's date as string, formatted as
// 7-2-2018 for July 2nd 2018
const unbundleDateForKey = timestamp => {
  const d = new Date(timestamp);
  return `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`;
};

// outbound call for currency conversion
// save the results in the cache for
// calls for this exact currency combination,
// anytime within a day
const fetchAndSaveConversion = request => {
  return fetch(request).then(networkResponse => {
    const clone = networkResponse.clone();
    if (clone.status === 200) {
      clone.json().then(data => {
        const now = Date.now();
        const conversions = Object.keys(data).reduce(
          (conversions, keyCombo) => {
            conversions.push({
              date: now,
              [keyCombo]: data[keyCombo],
              key: `${keyCombo}-${unbundleDateForKey(now)}`
            });
            return conversions;
          },
          []
        );
        dbSaveConversions(conversions);
      });
    }
    return networkResponse;
  });
};

// get currency conversions cached today,
// matching what the user is now interested in
const getCachedConversionQueries = ({ qryParts, conversions, dateKeyPart }) => {
  return qryParts.reduce((pool, q) => {
    const found = conversions.find(({ key }) => key === `${q}-${dateKeyPart}`);
    if (found !== undefined) {
      pool[q] = found[q];
    }

    return pool;
  }, {});
};

// the user wants to convert between currencies
// already converted and cached today and some
// for the first time
const fetchSaveAndMergeConversion = (url, cached) => {
  return fetchAndSaveConversion(url)
    .then(response => response.json())
    .then((data = {}) => {
      Object.keys(data).forEach(key => {
        cached[key] = data[key];
      });
      return generateAResponse(cached);
    });
};

// handle an API call to convert two
// or more currencies
const serveConversion = ({ request }, query) => {
  const qry = query.substring(query.indexOf('q=') + 2, query.indexOf('&'));
  const qryParts = qry.split(',');

  console.log(qryParts);
  const dateKeyPart = unbundleDateForKey(Date.now());
  return dbGetConversions().then(conversions => {
    console.log(conversions);
    if (!conversions || conversions.length === 0) {
      console.log(
        '%c Convertr SW %c ->',
        logstyle,
        '',
        'using network for debut conversion(s)'
      );
      return fetchAndSaveConversion(request);
    }

    const cachedQrys = getCachedConversionQueries({
      qryParts,
      conversions,
      dateKeyPart
    });

    console.log(cachedQrys);
    let leftOvers;
    const cachedQrysKeys = Object.keys(cachedQrys);
    console.log(cachedQrysKeys);
    if (cachedQrysKeys.length >= 1) {
      // user already made request for this conversion today

      // 1. is the entire request cached?
      // if so, respond right away with cached data
      if (cachedQrysKeys.length === qryParts.length) {
        console.log(
          '%c Convertr SW %c ->',
          logstyle,
          '',
          'using cache for',
          cachedQrysKeys.join(', ')
        );
        return generateAResponse(cachedQrys);
      }

      // 2. is only part of the request cached?
      // if so, fetch the uncached part, then merge
      // the final results with data from cache
      // before responding to user
      if (cachedQrysKeys.length !== qryParts.length) {
        leftOvers = qryParts.filter(q => !cachedQrysKeys.includes(q));
        console.log(leftOvers);
        const url = request.url.replace(qry, leftOvers.join(','));
        console.log(url);
        let resp = fetchSaveAndMergeConversion(url, cachedQrys);
        console.log(resp);
        return resp;
      }
    }

    console.log(
      '%c Convertr SW %c ->',
      logstyle,
      '',
      '... trying a new conversion today'
    );
    return fetchAndSaveConversion(request);
  });
};

// outbound call for countries data
// this should happen once for the
// life time of this application,
// TODO : unless there's a DB upgrade
const fetchAndSaveCountries = request => {
  return fetch(request).then(networkResponse => {
    const clone = networkResponse.clone();
    if (clone.status === 200) {
      clone.json().then(data => {
        dbSaveCountries(Object.values(data.results));
      });
    }
    return networkResponse;
  });
};

// handle API call to fetch countries data
const serveCountries = ({ request }) => {
  return dbGetCountries().then(countries => {
    if (!countries || countries.length === 0) {
      console.log('%c Convertr SW %c ->', logstyle, '', 'fetching countries');
      return fetchAndSaveCountries(request);
    }

    const mapped = countries.reduce((pool, country) => {
      pool[country.id] = country;
      return pool;
    }, {});

    console.log(
      '%c Convertr SW %c ->',
      logstyle,
      '',
      'using countries from cache'
    );
    return generateAResponse({ results: mapped });
  });
};

// handle commands from the UI
self.addEventListener('message', ({ data }) => {
  const { action } = data;
  if (action === 'SkipWaiting') {
    self.skipWaiting();
  }
});
