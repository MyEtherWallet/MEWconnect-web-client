import { isAddress } from './addressUtils';
import url from 'url';
import utils from 'web3-utils';
import { isHexString, toBuffer as utilsToBuffer } from 'ethereumjs-utils';
import { uint, address, string, bytes, bool } from './solidityTypes';

const toBuffer = v => {
  if (isHexString(v)) {
    return utilsToBuffer(v);
  }
  return Buffer.from(v);
};
const capitalize = value => {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
};
/* Accepts string, returns boolean */
const isJson = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
};

const getService = parsableUrl => {
  const parsedUrl = url.parse(parsableUrl).hostname;
  const splitUrl = parsedUrl.split('.');
  if (splitUrl.length > 2)
    // eslint-disable-next-line
    return capitalize(`${splitUrl[1]}.${splitUrl[2]}`);
  return capitalize(splitUrl.join('.'));
};

const doesExist = val => val !== undefined && val !== null;

const padLeftEven = hex => {
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return hex;
};

const isInt = num => {
  return num % 1 === 0;
};

const formatDate = date => {
  const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  const day = days[new Date(date).getDay()];
  const dateString = new Date(date).toLocaleDateString();
  const regExp = /\(([^)]+)\)/;
  const timeString = new Date(date).toTimeString();
  const lengthMinus1 = timeString.length - 1;
  const stripTimezone = timeString
    .slice(timeString.indexOf('(') + 1, lengthMinus1)
    .split(' ')
    .map(item => {
      return item[0];
    })
    .join('');
  const removedTimezone = timeString.replace(regExp, '');
  const removeEndNumber = removedTimezone.slice(0, 12);
  const GMTtime = removeEndNumber.replace(removeEndNumber.slice(5, 8), '');
  const localTime = new Date(date).toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${day}. ${dateString} ${GMTtime} - ${localTime} ${stripTimezone}`;
};
const isValidETHAddress = address => {
  return isAddress(address);
};
const isValidENSorEtherAddress = address => {
  return isValidETHAddress(address);
};

const sanitizeHex = hex => {
  hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
  if (hex == '') return '0x';
  return '0x' + padLeftEven(hex);
};

const scrollToTop = scrollDuration => {
  const scrollHeight = window.scrollY,
    scrollStep = Math.PI / (scrollDuration / 15),
    cosParameter = scrollHeight / 2;

  let scrollCount = 0;
  let scrollMargin;
  const scrollInterval = setInterval(function() {
    if (window.scrollY != 0) {
      scrollCount = scrollCount + 1;
      scrollMargin =
        cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
      window.scrollTo(0, scrollHeight - scrollMargin);
    } else clearInterval(scrollInterval);
  }, 15);
};

const validateHexString = str => {
  if (str === '') return true;
  str =
    str.substring(0, 2) === '0x'
      ? str.substring(2).toUpperCase()
      : str.toUpperCase();
  return utils.isHex(str);
};

const solidityType = inputType => {
  if (!inputType) inputType = '';
  if (inputType.includes('[') && inputType.includes(']')) {
    if (inputType.includes(uint))
      return { type: 'string', solidityType: `${uint}[]` };
    if (inputType.includes(address))
      return { type: 'text', solidityType: `${address}[]` };
    if (inputType.includes(string))
      return { type: 'text', solidityType: `${string}[]` };
    if (inputType.includes(bytes))
      return { type: 'text', solidityType: `${bytes}[]` };
    if (inputType.includes(bool))
      return { type: 'string', solidityType: `${bool}[]` };
    return { type: 'text', solidityType: `${string}[]` };
  }
  if (inputType.includes(uint)) return { type: 'number', solidityType: uint };
  if (inputType.includes(address))
    return { type: 'text', solidityType: address };
  if (inputType.includes(string)) return { type: 'text', solidityType: string };
  if (inputType.includes(bytes)) return { type: 'text', solidityType: bytes };
  if (inputType.includes(bool)) return { type: 'radio', solidityType: bool };
  return { type: 'text', solidityType: string };
};

const stringToArray = str => {
  return str.replace(/[^a-zA-Z0-9_,]+/g, '').split(',');
};

const isContractArgValid = (value, solidityType) => {
  if (!value) value = '';
  if (solidityType.includes('[') && solidityType.includes(']')) {
    const parsedValue = Array.isArray(value) ? value : stringToArray(value);
    const values = [];
    parsedValue.forEach(item => {
      if (solidityType.includes(uint)) {
        values.push(item !== '' && !isNaN(item) && isInt(item));
      } else if (solidityType.includes(address)) {
        values.push(isAddress(item));
      } else if (solidityType.includes(string)) {
        values.push(item !== '');
      } else if (solidityType.includes(bool)) {
        values.push(typeof item === typeof true || item === '');
      } else if (solidityType.includes(bytes)) {
        values.push(validateHexString(item));
      }
    });
    return !values.includes(false);
  }
  if (solidityType === 'uint')
    return value !== '' && !isNaN(value) && isInt(value);
  if (solidityType === 'address') return isAddress(value);
  if (solidityType === 'string') return true;
  if (solidityType === 'bytes')
    return value.substr(0, 2) === '0x' && validateHexString(value);
  if (solidityType === 'bool')
    return typeof value === typeof true || value === '';
  return false;
};

export default {
  isJson,
  doesExist,
  padLeftEven,
  formatDate,
  isValidENSorEtherAddress,
  isValidETHAddress,
  sanitizeHex,
  validateHexString,
  scrollToTop,
  solidityType,
  isInt,
  capitalize,
  getService,
  stringToArray,
  isContractArgValid,
  toBuffer
};
