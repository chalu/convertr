import { logger } from './utils.js';

const local = '';
// const ghPages = '/convertr';
const URIPrefix = local;
const { info, err } = logger('App');
const apiBase = 'https://free.currencyconverterapi.com/api/v5/convert';

const swUpdateReady = worker => {
  M.toast({ html: 'Updating to the latest and greatest version ...' });
  worker.postMessage({ action: 'skipWaiting' });
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

    navigator.serviceWorker
      .register(`${URIPrefix}/sw.js`, { scope: `${URIPrefix}/` })
      .then(reg => {
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
  if (!firstTo) return calls;

  if (firstTo && !secondTo) {
    return [...calls, fetch(`${apiBase}?q=${from}_${firstTo}&compact=ultra`)];
  }

  calls = [
    ...calls,
    fetch(`${apiBase}?q=${from}_${firstTo},${from}_${secondTo}&compact=ultra`)
  ];

  return callConverterAPI(from, moreTos, calls);
};

const loadCountries = () =>
  fetch('https://free.currencyconverterapi.com/api/v5/countries')
    .then(response => response.json())
    .catch(error => err(error));

const runApp = () => {
  // TODO wrap in rIC
  registerServiceWorker()
    .then(() => info('Registered Service Worker'))
    .catch(error => err(error));
};

export { callConverterAPI, loadCountries, runApp };
