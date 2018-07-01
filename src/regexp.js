const spaceDelimitter = /\s+/;
const commaDelimitter = /\s*,\s*/;
const srcToDestCurrencyDelimitter = /\s+>|to|in\s+/;
const queryCheckr = /^(\d+\s+)?[a-zA-Z]{3}\s+>|to|in\s+[a-zA-Z]{3}(\s*,\s*[a-zA-Z]{3})*$/;

export {
  spaceDelimitter,
  commaDelimitter,
  queryCheckr,
  srcToDestCurrencyDelimitter
};
