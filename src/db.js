const getDB = () =>
  idb.open('convertr', 1, upgradeDb => {
    const countriesStore = upgradeDb.createObjectStore('countries', {
      keyPath: 'id'
    });
    countriesStore.createIndex('by-abbrv', 'alpha3');

    const conversionsStore = upgradeDb.createObjectStore('conversions', {
      keyPath: 'key'
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