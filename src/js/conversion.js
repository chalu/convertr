import {
  rAF,
  trim,
  split,
  noopFn,
  queryCheckr,
  spaceDelimitter,
  srcToDestCurrencyDelimitter
} from './utils.js';

import { loadCountries, callConverterAPI } from './io.js';

let pBar;
let omnibox;
let srcResultEl;
let destResultEl;

const unbundleConversion = conversion => {
  const keys = Object.keys(conversion);
  return keys.filter(k => k.indexOf('_') !== -1).reduce((pool, key) => {
    const [from, to] = key.split(/_/);
    return [...pool, { from, to, key }];
  }, []);
};

const renderAConversion = (conversion, index, countries, amount) => {
  const bundles = unbundleConversion(conversion);
  bundles.forEach(({ key, from, to }) => {
    const figure = (parseFloat(conversion[key]) * amount).toFixed(2);
    const { currencyName: destCurrencyName } = countries[to];
    const { currencyName: srcCurrencyName } = countries[from];

    rAF().then(() => {
      if (index === 0) {
        srcResultEl.textContent = `${amount} ${srcCurrencyName.toLowerCase()}`;
      }

      const entry = document.createElement('li');
      let text = `${figure} ${destCurrencyName.toLowerCase()}`;

      entry.innerHTML = `<span>${text}</span>`;
      if (conversion.isUnwise === true) {
        // we are offline and pulled this
        // record that was cached much earlier in time
        entry.classList.add('unwise');
        entry.innerHTML = `<span class="timeago">recently</span> <span class="conversion">${text}</span>`;
      }
      destResultEl.appendChild(entry);
    });
  });
};

const renderForTheseCountries = (countries, amount) => (conversion, index) =>
  renderAConversion(conversion, index, countries, amount);

const optimizeQueryingWith = (currencies, amount) =>
  loadCountries()
    .then(({ results: countries } = {}) => {
      if (currencies && countries) {
        return currencies.reduce((countriesMapping, currency) => {
          const found = Object.values(countries).find(
            ({ currencyId, currencyName }) => {
              if (currency === 'USD') {
                return (
                  currencyId === currency &&
                  currencyName.startsWith('United States')
                );
              }
              return currencyId === currency;
            }
          );

          return found !== undefined
            ? { ...countriesMapping, ...{ [found.currencyId]: found } }
            : countriesMapping;
        }, {});
      }
      return {};
    })
    .then(countriesMapping => {
      // app is likely not properly initialised with needed data
      // e.g it is offline and there's no cached data
      if (Object.keys(countriesMapping).length === 0) return noopFn;

      return renderForTheseCountries(countriesMapping, amount);
    });

const renderConversions = (conversions, currencies, amount = 1) => {
  srcResultEl = srcResultEl || document.querySelector('#src-result');
  destResultEl = destResultEl || document.querySelector('#dest-result');

  // cater for malicious / un-serious
  // entries like zeros or negative numbers
  if (amount < 1) amount = 1;

  const rendererResolver = optimizeQueryingWith(currencies, amount);
  rendererResolver.then(renderer => {
    rAF().then(() => {
      destResultEl.innerHTML = '';
      srcResultEl.innerHTML = '';

      const resultsEl = document.querySelector('#converter-result-wrap');
      if (!resultsEl.classList.contains('has-results')) {
        resultsEl.classList.add('has-results');
      }
    });
    conversions.forEach(renderer);
  });
};

const beginConverting = () => {
  pBar = pBar || document.querySelector('.preloader-wrapper');
  rAF().then(() => pBar.classList.add('active'));
};

const doneConverting = () => {
  pBar = pBar || document.querySelector('.preloader-wrapper');
  rAF().then(() => pBar.classList.remove('active'));
};

const handleAConversion = event => {
  let {
    keyCode,
    target: { value }
  } = event;

  // was the enter key used instead
  if (keyCode && keyCode !== 13) return;

  omnibox = omnibox || document.querySelector('#omnibox');
  rAF().then(() => omnibox.classList.remove('invalid'));

  // was the button clicked instead
  if (!keyCode) {
    value = omnibox.value;
  }

  // clean and validate query before proceeding
  const entry = trim(value);
  if (queryCheckr.test(entry) === false) {
    rAF().then(() => omnibox.classList.add('invalid'));
    return;
  }

  const [from, to] = split(entry, srcToDestCurrencyDelimitter);
  let dest = split(to)
    .filter(item => item !== '')
    .map(item => trim(item).toUpperCase());

  const unpackedFrom = trim(from)
    .toUpperCase()
    .split(spaceDelimitter);

  let src;
  let amount;
  if (unpackedFrom.length === 1) {
    [src] = unpackedFrom;
  } else if (unpackedFrom.length === 2) {
    [amount, src] = unpackedFrom;
  }

  // disallow trying to convert
  // between the exact same currency
  // e.g USD to USD
  dest = dest.filter(d => d !== src);
  if (dest.length === 0) {
    rAF().then(() => omnibox.classList.add('invalid'));
    return;
  }

  beginConverting();

  // TODO
  // Are we making these API calls
  // in parallel or in sequence?
  // Better if they are in parallel
  Promise.all(callConverterAPI(src, dest))
    .then(responses =>
      responses
        .filter(response => response && response.status === 200)
        .map(response => response.json())
    )
    .then(successfulResponses => {
      Promise.all(successfulResponses).then(conversions => {
        renderConversions(conversions, [src, ...dest], amount);
        doneConverting();
      });
    });
};

export default handleAConversion;
