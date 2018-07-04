const spaceDelimitter = /\s+/;
const commaDelimitter = /\s*,\s*/;
const srcToDestCurrencyDelimitter = /\s+>|to|in\s+/;
const queryCheckr = /^(\d+\s+)?[a-zA-Z]{3}\s+>|to|in\s+[a-zA-Z]{3}(\s*,\s*[a-zA-Z]{3})*$/;

const trim = (str = '') => str.trim();
const split = (str = '', regExp = commaDelimitter) => str.split(regExp);

const rAF = () => new Promise(requestAnimationFrame);

export {
  rAF,
  trim, split,
  spaceDelimitter,
  commaDelimitter,
  queryCheckr,
  srcToDestCurrencyDelimitter
};
