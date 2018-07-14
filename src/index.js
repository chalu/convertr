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
    M.Toast.dismissAll();
    M.toast({ html: 'your connetion has been restored!' });
    wasJustOffline = false;
  }
};

const notifyOffline = () => {
  M.Toast.dismissAll();
  M.toast({ html: 'you no longer have connetion!' });
};

const handleOffline = () => {
  documentBody = documentBody || document.querySelector('body');
  documentBody.classList.add('offline');
  wasJustOffline = true;
  notifyOffline();
};

const initConverter = () => {
  M.FormSelect.init(document.querySelectorAll('select'));

  document
    .querySelector('#omnibox')

    // TODO might need to debounce / throttle
    // calls to handleAConversion
    .addEventListener('keyup', handleAConversion);

  document.querySelector('#mode-switch').addEventListener('click', switchUI);

  document.querySelector('#offline').addEventListener('click', notifyOffline);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  if (navigator.onLine !== undefined && navigator.onLine === false) {
    handleOffline();
  }

  runApp();
};
document.addEventListener('DOMContentLoaded', initConverter);
