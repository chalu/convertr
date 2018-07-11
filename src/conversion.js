import {
  rAF,
  trim, split, 
  spaceDelimitter,
  queryCheckr,
  srcToDestCurrencyDelimitter
} from './utils.js';

import { loadCountries, callConverterAPI } from './io.js';

let pBar;
let srcResultEl;
let destResultEl;

const unbundleConversion = conversion => {
  const keys = Object.keys(conversion);
  return keys.reduce((pool, key) => {
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

    if (index === 0) {
      srcResultEl.textContent = `${amount} ${srcCurrencyName.toLowerCase()}`;
    }

    const entry = document.createElement('li');
    entry.textContent = `${figure} ${destCurrencyName.toLowerCase()}`;
    destResultEl.appendChild(entry);
  });
};

const renderForTheseCountries = (countries, amount) => (conversion, index) => {
  renderAConversion(conversion, index, countries, amount);
};

const optimizeQueryingWith = (currencies, amount) =>
  loadCountries()
    .then(({ results: countries }) =>
      currencies.reduce((countriesMapping, currency) => {
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
      }, {})
    )
    .then(countriesMapping =>
      renderForTheseCountries(countriesMapping, amount)
    );

const renderConversions = (conversions, currencies, amount = 1) => {
  srcResultEl = srcResultEl || document.querySelector('#src-result');
  destResultEl = destResultEl || document.querySelector('#dest-result');

  const rendererResolver = optimizeQueryingWith(currencies, amount);
  rendererResolver.then(renderer => {
    destResultEl.innerHTML = '';
    srcResultEl.innerHTML = '';

    const resultsEl = document.querySelector('#converter-result-wrap');
    if (!resultsEl.classList.contains('has-results')) {
      resultsEl.classList.add('has-results');
    }

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
  const {
    keyCode,
    target: { value }
  } = event;
  if (keyCode !== 13) return;

  // clean and validate query on enter key
  const entry = trim(value);
  if (queryCheckr.test(entry) === false) return;

  const [from, to] = split(entry, srcToDestCurrencyDelimitter);
  const dest = split(to)
    .filter(item => item !== '')
    .map(item => trim(item));
  const unpackedFrom = trim(from).split(spaceDelimitter);

  let src;
  let amount;
  if (unpackedFrom.length === 1) {
    [src] = unpackedFrom;
  } else if (unpackedFrom.length === 2) {
    [amount, src] = unpackedFrom;
  }

  beginConverting();
  Promise.all(callConverterAPI(src, dest))
    .then(calls =>
      calls
        .filter(({ status }) => status === 200)
        .map(response => response.json())
    )
    .then(called => {
      Promise.all(called).then(conversions => {
        renderConversions(conversions, [src, ...dest], amount);
        doneConverting();
      });
    });
};

export default handleAConversion;
