import { commaDelimitter } from './regexp.js';

const trim = (str = '') => str.trim();
const split = (str = '', regExp = commaDelimitter) => str.split(regExp);

export { trim, split };