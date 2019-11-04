import { runApp } from './io.js';
import handleAConversion from './conversion.js';

const initConverter = () => {

  document
    .querySelector('#omnibox')

    // TODO might need to debounce / throttle
    // calls to handleAConversion
    .addEventListener('keyup', handleAConversion);

  document.querySelector('#go-convert').addEventListener('click', handleAConversion);
  runApp();
};
document.addEventListener('DOMContentLoaded', initConverter);
