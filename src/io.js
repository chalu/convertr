const apiBase = 'https://free.currencyconverterapi.com/api/v5/convert';

const swUpdateReady = worker => {
  worker.postMessage({ action: 'skipWaiting' });
  // var toast = this._toastsView.show("New version available", {
  //   buttons: ['refresh', 'dismiss']
  // });
  // toast.answer.then(function(answer) {
  //   if (answer != 'refresh') return;
  //   worker.postMessage({action: 'skipWaiting'});
  // });
  return worker;
};

const trackSwInstallation = worker => {
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed') {
      swUpdateReady(worker);
    }
  });
  return worker;
};

const registerServiceWorker = () =>
  new Promise(resolve => {
    if (!navigator.serviceWorker) resolve();

    navigator.serviceWorker.register('/sw.js').then(reg => {
      // if (!navigator.serviceWorker.controller) return;

      if (reg.waiting) {
        resolve(swUpdateReady(reg.waiting));
        return;
      }

      if (reg.installing) {
        resolve(trackSwInstallation(reg.installing));
        return;
      }

      reg.addEventListener('updatefound', () =>
        trackSwInstallation(reg.installing)
      );
    });
  });

const callConverterAPI = (
  from,
  [firstTo, secondTo, ...moreTos],
  calls = []
) => {
  if (firstTo === undefined) return calls;

  if (secondTo === undefined) {
    calls.push(fetch(`${apiBase}?q=${from}_${firstTo}&compact=ultra`));
    return calls;
  }

  calls.push(
    fetch(`${apiBase}?q=${from}_${firstTo},${from}_${secondTo}&compact=ultra`)
  );
  return callConverterAPI(from, moreTos, calls);
};

const loadCountries = () =>
  // TODO check and load from DB first
  // only call out if not in DB
  // if (countries) return Promise.resolve({ results: countries });

  fetch('https://free.currencyconverterapi.com/api/v5/countries')
        .then(response => response.json())
        .catch(console.error);


const runApp = () => {
  registerServiceWorker()
    .then(worker => {
      console.log('Done Registered SW', worker);
      // dbGetCountries().then(c => {
      //   console.log(c);
      //   if (!c || c.length === 0) {
      //     loadCountries().then(({ results: countries }) => {
      //       console.log(countries);
      //       dbSaveCountries(Object.values(countries));
      //     });
      //   }
      // });
      // loadCountries()
      // .then(({ results: countries }) => {
      //   getCountries = countriesFactory(countries);
      //   console.log('gotten countries');
      // })
    })
    .catch(error => console.error(error));
};

export { callConverterAPI, loadCountries, runApp };
