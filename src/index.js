import { runApp } from './io.js';
import handleAConversion from './conversion.js';

let documentBody;
let switchables;
let wasJustOffline = false;

const switchUI = () => {
  switchables = switchables || document.querySelectorAll('.layer.switchable');
  Array.from(switchables).forEach(layer => {
    if (layer.classList.contains('expanded')) {
      layer.classList.remove('expanded');
    } else {
      layer.classList.add('expanded');
    }
  });
};

const handleOnline = () => {
  documentBody = documentBody || document.querySelector('body');
  documentBody.classList.remove('offline');
  if(wasJustOffline === true) {
    // your connetion has been restored!
    wasJustOffline = false;
  }
};

const notifyOffline = () => {
  // you no longer have connection!
};

const handleOffline = () => {
  documentBody = documentBody || document.querySelector('body');
  documentBody.classList.add('offline');
  wasJustOffline = true;
  notifyOffline();
};

const initConverter = () => {

  document
    .querySelector('#omnibox')

    // TODO might need to debounce / throttle
    // calls to handleAConversion
    .addEventListener('keyup', handleAConversion);

  document.querySelector('#go-convert').addEventListener('click', handleAConversion);

  document.querySelector('#offline').addEventListener('click', notifyOffline);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  if (navigator.onLine !== undefined && navigator.onLine === false) {
    handleOffline();
  }

  runApp();
};
document.addEventListener('DOMContentLoaded', initConverter);
