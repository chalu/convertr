!function(e){var t={};function r(n){if(t[n])return t[n].exports;var o=t[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=3)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n="https://free.currencyconverterapi.com/api/v5/convert",o=function(e){return M.toast({html:"Updating to the latest and greatest version ..."}),e.postMessage({action:"skipWaiting"}),e},i=function(e){return e.addEventListener("statechange",function(){"installed"===e.state&&o(e)}),e};t.callConverterAPI=function e(t,r){var o=function(e){return Array.isArray(e)?e:Array.from(e)}(r),i=o[0],u=o[1],c=o.slice(2),a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[];return void 0===i?a:void 0===u?(a.push(fetch(n+"?q="+t+"_"+i+"&compact=ultra")),a):(a.push(fetch(n+"?q="+t+"_"+i+","+t+"_"+u+"&compact=ultra")),e(t,c,a))},t.loadCountries=function(){return fetch("https://free.currencyconverterapi.com/api/v5/countries").then(function(e){return e.json()}).catch(console.error)},t.runApp=function(){new Promise(function(e){navigator.serviceWorker||e(),navigator.serviceWorker.register("/sw.js").then(function(t){t.waiting?e(o(t.waiting)):t.installing?e(i(t.installing)):t.addEventListener("updatefound",function(){return i(t.installing)})})}).then(function(){return console.log("Registered Service Worker")}).catch(function(e){return console.error(e)})}},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=/\s*,\s*/;t.rAF=function(){return new Promise(requestAnimationFrame)},t.trim=function(){return(arguments.length>0&&void 0!==arguments[0]?arguments[0]:"").trim()},t.split=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:n;return e.split(t)},t.spaceDelimitter=/\s+/,t.commaDelimitter=n,t.queryCheckr=/^(\d+\s+)?[a-zA-Z]{3}\s+>|to|in\s+[a-zA-Z]{3}(\s*,\s*[a-zA-Z]{3})*$/,t.srcToDestCurrencyDelimitter=/\s+>|to|in\s+/},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},o=function(){return function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var r=[],n=!0,o=!1,i=void 0;try{for(var u,c=e[Symbol.iterator]();!(n=(u=c.next()).done)&&(r.push(u.value),!t||r.length!==t);n=!0);}catch(e){o=!0,i=e}finally{try{!n&&c.return&&c.return()}finally{if(o)throw i}}return r}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),i=r(1),u=r(0);function c(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}var a=void 0,s=void 0,l=void 0,f=function(e,t,r,n){(function(e){return Object.keys(e).reduce(function(e,t){var r=t.split(/_/),n=o(r,2),i=n[0],u=n[1];return[].concat(c(e),[{from:i,to:u,key:t}])},[])})(e).forEach(function(o){var i=o.key,u=o.from,c=o.to,a=(parseFloat(e[i])*n).toFixed(2),f=r[c].currencyName,d=r[u].currencyName;0===t&&(s.textContent=n+" "+d.toLowerCase());var v=document.createElement("li");v.textContent=a+" "+f.toLowerCase(),l.appendChild(v)})},d=function(e,t){return(0,u.loadCountries)().then(function(t){var r=t.results;return e.reduce(function(e,t){var o=Object.values(r).find(function(e){var r=e.currencyId,n=e.currencyName;return"USD"===t?r===t&&n.startsWith("United States"):r===t});return void 0!==o?n({},e,function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}({},o.currencyId,o)):e},{})}).then(function(e){return function(e,t){return function(r,n){f(r,n,e,t)}}(e,t)})};t.default=function(e){var t=e.keyCode,r=e.target.value;if(13===t){var n=(0,i.trim)(r);if(!1!==i.queryCheckr.test(n)){var f=(0,i.split)(n,i.srcToDestCurrencyDelimitter),v=o(f,2),p=v[0],y=v[1],m=(0,i.split)(y).filter(function(e){return""!==e}).map(function(e){return(0,i.trim)(e)}),h=(0,i.trim)(p).split(i.spaceDelimitter),g=void 0,b=void 0;if(1===h.length){var L=o(h,1);g=L[0]}else if(2===h.length){var A=o(h,2);b=A[0],g=A[1]}a=a||document.querySelector(".preloader-wrapper"),(0,i.rAF)().then(function(){return a.classList.add("active")}),Promise.all((0,u.callConverterAPI)(g,m)).then(function(e){return e.filter(function(e){return 200===e.status}).map(function(e){return e.json()})}).then(function(e){Promise.all(e).then(function(e){!function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;s=s||document.querySelector("#src-result"),l=l||document.querySelector("#dest-result"),d(t,r).then(function(t){l.innerHTML="",s.innerHTML="";var r=document.querySelector("#converter-result-wrap");r.classList.contains("has-results")||r.classList.add("has-results"),e.forEach(t)})}(e,[g].concat(c(m)),b),a=a||document.querySelector(".preloader-wrapper"),(0,i.rAF)().then(function(){return a.classList.remove("active")})})})}}}},function(e,t,r){"use strict";var n=r(0),o=function(e){return e&&e.__esModule?e:{default:e}}(r(2));var i=void 0,u=void 0,c=!1,a=function(){u=u||document.querySelectorAll(".layer.switchable"),Array.from(u).forEach(function(e){e.classList.contains("expanded")?e.classList.remove("expanded"):e.classList.add("expanded")})},s=function(){(i=i||document.querySelector("body")).classList.remove("offline"),!0===c&&(M.toast({html:"your connetion has been restored!"}),c=!1)},l=function(){M.toast({html:"you no longer have connetion!"})},f=function(){(i=i||document.querySelector("body")).classList.add("offline"),c=!0,l()};document.addEventListener("DOMContentLoaded",function(){M.FormSelect.init(document.querySelectorAll("select")),document.querySelector("#omnibox").addEventListener("keyup",o.default),document.querySelector("#mode-switch").addEventListener("click",a),document.querySelector("#offline").addEventListener("click",l),window.addEventListener("online",s),window.addEventListener("offline",f),void 0!==navigator.onLine&&!1===navigator.onLine&&f(),(0,n.runApp)()})}]);