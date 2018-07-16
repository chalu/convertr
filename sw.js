importScripts('./node_modules/idb/lib/idb.js');

const appPrefix = 'convertr-';
const staticCacheName = `${appPrefix}static-v1`;
const allCaches = [staticCacheName];
const URIPrefix = '.';

// some utils
const log = (...msgs) => {
  console.log(
    `%c Convertr SW %c ->`,
    'background:#26a69a;color:#fff;display:block;',
    '',
    ...msgs
  );
};

const responseCanErr = response => {
  if (!response.ok) throw Error(response.status);
  return response;
};

/* IndexedDB onperations
*************************** */

// object store names
const COUNTRIES = 'countries';
const CONVERSIONS = 'conversions';

// open/get connection to database
const getDB = () =>
  idb.open('convertr', 1, upgradeDb => {
    const countriesStore = upgradeDb.createObjectStore(COUNTRIES, {
      keyPath: 'id'
    });
    countriesStore.createIndex('by-abbrv', 'alpha3');

    const conversionsStore = upgradeDb.createObjectStore(CONVERSIONS, {
      keyPath: 'key'
    });
    conversionsStore.createIndex('by-date', 'date');
  });

const dbSaveCollection = (collection, store, db) =>
  collection.reduce((prevTnx, entry) => {
    const tnx = db.transaction(store, 'readwrite');
    tnx.objectStore(store).add(entry);

    return prevTnx.then(() => tnx.complete);
  }, Promise.resolve());

// get countries data from DB
const dbGetCountries = () =>
  getDB().then(db =>
    db
      .transaction(COUNTRIES)
      .objectStore(COUNTRIES)
      .index('by-abbrv')
      .getAll()
  );

// save countries data to DB
const dbSaveCountries = countries =>
  getDB().then(db => dbSaveCollection(countries, COUNTRIES, db));

// get currency conversions data from DB
const dbGetConversions = () => {
  return getDB().then(db => {
    return db
      .transaction(CONVERSIONS)
      .objectStore(CONVERSIONS)
      .index('by-date')
      .getAll();
  });
};

/* End IndexedDB onperations
****************************** */

// save currency conversions to DB
const dbSaveConversions = conversions =>
  getDB().then(db => dbSaveCollection(conversions, CONVERSIONS, db));

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll([
        `${URIPrefix}/`,
        `${URIPrefix}/index.html`,
        `${URIPrefix}/dist/main.js`,
        `${URIPrefix}/src/index.js`,
        `${URIPrefix}/node_modules/idb/lib/idb.js`,
        `${URIPrefix}/statics/images/optimized/didier-weemaels-36055-unsplash.jpg`,
        `${URIPrefix}/statics/images/optimized/didier-weemaels-36055-unsplash-grey.jpg`,
        `${URIPrefix}/node_modules/materialize-css/dist/css/materialize.min.css`,
        `${URIPrefix}/node_modules/materialize-css/dist/js/materialize.min.js`
      ]);
    })
  );
});

// TODO delete conversions in DB older then 1 week
// OR make this a default setting that the user can alter
// with a settings UI
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return (
              cacheName.startsWith(`${appPrefix}`) &&
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
  // if they exisit or consult the network
  // TODO how does the second call to fetch slow things down?
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

const getQueryParts = search => {
  const query = search.substring(search.indexOf('q=') + 2, search.indexOf('&'));
  const parts = query.split(',');
  return { query, parts };
};

const queueConversionRequest = (parts) => {
  log('queueConversionRequest', parts, self);
};

const respondFromHistoryOrDefaultToZeroThenQueue = ({url}) => {
  const search = new URL(url).search;
  const { parts } = getQueryParts(search);
  return dbGetConversions().then(conversions => {
    const unwiseConversions = parts.reduce((pool, part) => {
      let found = conversions.find(cvn => cvn.key.startsWith(part));
      if(found) {
        pool[part] = found[part];
      } else {
        pool[part] = 0;
      }
      return pool;
    }, {isUnwise: true});

    // TODO queue a request for the conversion 
    queueConversionRequest(parts);
    return generateAResponse(unwiseConversions);
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
// anytime within same day
const fetchAndSaveConversion = request => {
  return fetch(request)
    .then(responseCanErr)
    .then(networkResponse => {
      const clone = networkResponse.clone();
      // TODO make this flow asynchronous
      // let net wait to complete the DB operation before
      // responding for this request
      clone.json().then(data => {
        const now = Date.now();
        // const now = 1531447229620;
        const formattedConversions = Object.keys(data).reduce(
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
        dbSaveConversions(formattedConversions);
      });
      return networkResponse;
    })
    .catch(error => {
      log(`Error fetching ${request.url}`, error.message);
      return respondFromHistoryOrDefaultToZeroThenQueue(request);
    });
};

// get currency conversions cached today,
// matching what the user is now interested in
const getCachedConversionQueries = ({ parts, conversions, dateKey }) => {
  return parts.reduce((pool, q) => {
    const found = conversions.find(({ key }) => key === `${q}-${dateKey}`);
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
const serveConversion = ({ request }, search) => {
  const { query, parts } = getQueryParts(search);

  const dateKey = unbundleDateForKey(Date.now());
  return dbGetConversions().then(conversions => {
    if (!conversions || conversions.length === 0) {
      log('using network for debut conversion(s)');
      return fetchAndSaveConversion(request);
    }

    log(query, parts);
    const cachedQrys = getCachedConversionQueries({
      parts,
      conversions,
      dateKey
    });

    let leftOvers;
    log('cachedQrys', cachedQrys);
    const cachedQrysKeys = Object.keys(cachedQrys);
    if (cachedQrysKeys.length >= 1) {
      // user already made request for this conversion today

      // 1. is the entire request cached?
      // if so, respond right away with cached data
      if (cachedQrysKeys.length === parts.length) {
        log('using cache for', cachedQrysKeys.join(', '));
        return generateAResponse(cachedQrys);
      }

      // 2. is only part of the request cached?
      // if so, fetch the uncached part, then merge
      // the final results with data from cache
      // before responding to user
      if (cachedQrysKeys.length !== parts.length) {
        leftOvers = parts.filter(q => !cachedQrysKeys.includes(q));
        const url = request.url.replace(query, leftOvers.join(','));
        return fetchSaveAndMergeConversion(url, cachedQrys);
      }
    }

    log('... requesting a new conversion today');
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
      log('fetching countries');
      return fetchAndSaveCountries(request);
    }

    const formattedCountries = countries.reduce((pool, country) => {
      pool[country.id] = country;
      return pool;
    }, {});

    log('using countries from cache');
    return generateAResponse({ results: formattedCountries });
  });
};

// handle commands from the UI
self.addEventListener('message', ({ data }) => {
  const { action } = data;
  if (action === 'SkipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag == 'clear-outbox') {
    log('handling', event.tag)
    //event.waitUntil(doSomeStuff());
  }
});
