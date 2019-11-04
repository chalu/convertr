import { logger } from './utils.js';
import dotenv from 'dotenv';

dotenv.config();

const local = '';
// const ghPages = '/convertr';
const URIPrefix = local;
const { info, err } = logger('App');

const apiKey = `apiKey=${process.env.apiKey}`;
const apiBase = 'https://free.currconv.com/api/v7';

const swUpdateReady = worker => {
  // 'Updating to the latest and greatest version ...'
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

const registerServiceWorker = async () => {
  if (!navigator.serviceWorker) return;

    await navigator.serviceWorker
      .register(`${URIPrefix}/sw.js`, { scope: `${URIPrefix}/` });
};

const callConverterAPI = (
  from,
  [firstTo, secondTo, ...moreTos],
  calls = []
) => {
  if (!firstTo) return calls;

  if (firstTo && !secondTo) {
    return [...calls, fetch(`${apiBase}/convert?q=${from}_${firstTo}&compact=ultra&${apiKey}`)];
  }

  calls = [
    ...calls,
    fetch(`${apiBase}/convert?q=${from}_${firstTo},${from}_${secondTo}&compact=ultra&${apiKey}`)
  ];

  return callConverterAPI(from, moreTos, calls);
};

const loadCountries = () =>
  fetch(`${apiBase}/countries?${apiKey}`)
    .then(response => response.json())
    .catch(error => err(error));

const runApp = async () => {
  // try {
  //   await registerServiceWorker();
  //   info('Registered Service Worker');
  // } catch (error) {
  //   err(error.message);
  // }
};

export { callConverterAPI, loadCountries, runApp };
