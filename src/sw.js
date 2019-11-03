
/** minified and inlined version of https://github.com/jakearchibald/idb */
!function(){"use strict";function e(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function t(t,n,o){var r,i=new Promise(function(i,u){e(r=t[n].apply(t,o)).then(i,u)});return i.request=r,i}function n(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function o(e,n,o,r){r.forEach(function(r){r in o.prototype&&(e.prototype[r]=function(){return t(this[n],r,arguments)})})}function r(e,t,n,o){o.forEach(function(o){o in n.prototype&&(e.prototype[o]=function(){return this[t][o].apply(this[t],arguments)})})}function i(e,n,o,r){r.forEach(function(r){r in o.prototype&&(e.prototype[r]=function(){return e=this[n],(o=t(e,r,arguments)).then(function(e){if(e)return new c(e,o.request)});var e,o})})}function u(e){this._index=e}function c(e,t){this._cursor=e,this._request=t}function s(e){this._store=e}function p(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function a(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new p(n)}function f(e){this._db=e}n(u,"_index",["name","keyPath","multiEntry","unique"]),o(u,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),i(u,"_index",IDBIndex,["openCursor","openKeyCursor"]),n(c,"_cursor",["direction","key","primaryKey","value"]),o(c,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(t){t in IDBCursor.prototype&&(c.prototype[t]=function(){var n=this,o=arguments;return Promise.resolve().then(function(){return n._cursor[t].apply(n._cursor,o),e(n._request).then(function(e){if(e)return new c(e,n._request)})})})}),s.prototype.createIndex=function(){return new u(this._store.createIndex.apply(this._store,arguments))},s.prototype.index=function(){return new u(this._store.index.apply(this._store,arguments))},n(s,"_store",["name","keyPath","indexNames","autoIncrement"]),o(s,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),i(s,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),r(s,"_store",IDBObjectStore,["deleteIndex"]),p.prototype.objectStore=function(){return new s(this._tx.objectStore.apply(this._tx,arguments))},n(p,"_tx",["objectStoreNames","mode"]),r(p,"_tx",IDBTransaction,["abort"]),a.prototype.createObjectStore=function(){return new s(this._db.createObjectStore.apply(this._db,arguments))},n(a,"_db",["name","version","objectStoreNames"]),r(a,"_db",IDBDatabase,["deleteObjectStore","close"]),f.prototype.transaction=function(){return new p(this._db.transaction.apply(this._db,arguments))},n(f,"_db",["name","version","objectStoreNames"]),r(f,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[s,u].forEach(function(t){e in t.prototype&&(t.prototype[e.replace("open","iterate")]=function(){var t,n=(t=arguments,Array.prototype.slice.call(t)),o=n[n.length-1],r=this._store||this._index,i=r[e].apply(r,n.slice(0,-1));i.onsuccess=function(){o(i.result)}})})}),[u,s].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,o=[];return new Promise(function(r){n.iterateCursor(e,function(e){e?(o.push(e.value),void 0===t||o.length!=t?e.continue():r(o)):r(o)})})})});var d={open:function(e,n,o){var r=t(indexedDB,"open",[e,n]),i=r.request;return i&&(i.onupgradeneeded=function(e){o&&o(new a(i.result,e.oldVersion,i.transaction))}),r.then(function(e){return new f(e)})},delete:function(e){return t(indexedDB,"deleteDatabase",[e])}};"undefined"!=typeof module?(module.exports=d,module.exports.default=module.exports):self.idb=d}();

const appPrefix = 'convertr-';
const staticCacheName = `${appPrefix}static-v2.5`;
const allCaches = [staticCacheName];

const local = '.';
// const ghPages = '/convertr';
const URIPrefix = local;

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
const OUTBOX = 'outbox';
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

    const outboxStore = upgradeDb.createObjectStore(OUTBOX, {
      keyPath: 'key'
    });
    outboxStore.createIndex('by-date', 'date');
  });

const dbSaveCollection = (collection, store, db) =>
  collection.reduce((prevTnx, entry) => {
    const tnx = db.transaction(store, 'readwrite');
    tnx.objectStore(store).put(entry);

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

// save currency conversions to DB
const dbSaveConversions = conversions =>
  getDB().then(db => dbSaveCollection(conversions, CONVERSIONS, db));

// save conversions to Outbox queue in DB
const dbSaveToOutbox = conversions =>
  getDB().then(db => dbSaveCollection(conversions, OUTBOX, db));

// get conversions in Outbox queue
const dbGetFromOutbox = () => {
  return getDB().then(db => {
    return db
      .transaction(OUTBOX)
      .objectStore(OUTBOX)
      .index('by-date')
      .getAll();
  });
};

/* End IndexedDB onperations
****************************** */

const installAndSkipWaiting = async () => {
  const cache = await caches.open(staticCacheName);
  await cache.addAll([
    `${URIPrefix}/`,
    `${URIPrefix}/index.html`,
    `${URIPrefix}/dist/main.js`,
    `${URIPrefix}/node_modules/idb/lib/idb.js`,
    `${URIPrefix}/statics/images/icons/icon-72x72.png`,
    `${URIPrefix}/statics/images/christine-roy-343235-unsplash.jpg`,
    `${URIPrefix}/statics/images/christine-roy-343235-unsplash-off.jpg`
  ]);

  return self.skipWaiting();
};

const pruneCaches = async () => {
  const cacheNames = await caches.keys();
  const staleCaches = cacheNames
    .filter(
      cacheName =>
        cacheName.startsWith(appPrefix) && !allCaches.includes(cacheName)
    )
    .map(cacheName => caches.delete(cacheName));

  await Promise.all(staleCaches);
  return self.clients.claim();
};

self.addEventListener('install', async (event) => {
  event.waitUntil(installAndSkipWaiting());
});

// TODO delete conversions in DB older then 1 week
// OR make this a default setting that the user can alter
// with a settings UI
self.addEventListener('activate', event => {
  event.waitUntil(pruneCaches());
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // API call for countries data
  if (requestUrl.pathname === '/api/v7/countries') {
    event.respondWith(serveCountries(event));
    return;
  }

  // API call to convert between curencies
  if (requestUrl.pathname.includes('/api/v7/convert')) {
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
  const now = Date.now();
  const queue = parts.map(part => ({
    key: part, date: now
  }));
  
  dbSaveToOutbox(queue);
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
      // lets not wait to complete the DB operation before
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
// already cached today and some for the first time
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

const handleOutboxQueue = () => {
  // 1. are there items in the queue
  // 2. if so, get them (their keys) and issue conversion requests
  // 3. populate DB with the results and clear queue in DB
  // 4. display a notification
  return Promise.resolve();
};


self.addEventListener('sync', (event) => {
  if (event.tag == 'clear-outbox') {
    event.waitUntil(handleOutboxQueue());
  }
});
