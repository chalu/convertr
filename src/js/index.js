import { runApp } from './io.js';
import { noopFn, notifyr } from './utils.js';

import handleAConversion from './conversion.js';

let documentBody;
let notify = noopFn;
let wasJustOffline = false;

const handleOnline = () => {
  documentBody = documentBody || document.querySelector('body');
  documentBody.classList.remove('offline');
  if(wasJustOffline === true) {
    notify('your connetion has been restored!');
    wasJustOffline = false;
  }
};

const notifyOffline = () => {
  notify('you no longer have connection!');
};

const handleOffline = () => {
  documentBody = documentBody || document.querySelector('body');
  documentBody.classList.add('offline');
  wasJustOffline = true;
  notifyOffline();
};

const preLaunch = () => {
  if(! window || !"Notification" in window) return;

  if(Notification.permission !== 'denied') {
    Notification.requestPermission(status => {
      if(status === 'granted') notify = notifyr;
    });
  }
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

  preLaunch();
  runApp();
};
document.addEventListener('DOMContentLoaded', initConverter);
