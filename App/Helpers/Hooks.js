/**
 * Use this Helper to create your own custom functions
 */
import lang from 'App/Helpers/Languages';
import moment from 'moment';
import { Alert, Dimensions, Platform, PixelRatio } from 'react-native';

export const room_private = 1;
export const room_group = 2;
export const have_shop = 1;
export const isJSDebugEnable = (typeof atob !== 'undefined');

export const REGULER_USER = 80;
export const MAX_NOTIF_COUNT = 99;

export const RENT_TYPE = 'rent';
export const BUY_TYPE = 'buy';
export const OFFICE = 'tower';
export const APARTMENT = 'complex';

var locale = require('moment/locale/id');
moment.locale('id', locale);

const waitDebug = 300; // 150ms
const waitProd = 150; // 10ms

const pixelRatio = PixelRatio.get();
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
export const screenRatio = deviceHeight / deviceWidth;

const milInSecond = 1000;
const secondInMinutes = 60;
const minutesInHour = 60;
const hourInDay = 24;
const dayInWeeks = 7;
const weekInMonths = 4;
const monthInYear = 12;
const keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export function consoleLog(TAG: String, message: String, force: Boolean = false) {
  if (__DEV__ || force === true) { // if in Development mode
    console.log("###" + TAG + " => ", message);
  }
}
export function consoleError(TAG: String, message: String, force: Boolean = false) {
  if (__DEV__ || force === true) { // if in Development mode
    console.error("###" + TAG + " => ", message);
  }
}

/**
 * Get & Formatting date
 *
 * @param {Object/String} date - contain JS Date Object, or formatted date string
 * @param {Boolean} time - wants to display time?
 * @param {String} - Date output format, using format like php
 *
 * @return {String} Formatted date
 */
export function getFormatDate(date = [], time = true, output_format = 'Y-m-d', getDate = true) {
  // Convert to JS Date Object
  if (!date)
    date = moment().toDate();
  else
    date = moment(date).toDate();

  let year = date.getFullYear(),
    month = '' + (date.getMonth() + 1),
    day = '' + date.getDate(),
    hour = '' + date.getHours(),
    second = '' + date.getSeconds(),
    minute = '' + date.getMinutes();

  // Reformat to 2 digits
  month = (month.length < 2) ? '0' + month : month;
  day = (day.length < 2) ? '0' + day : day;
  hour = (hour.length < 2) ? '0' + hour : hour;
  minute = (minute.length < 2) ? '0' + minute : minute;
  second = (second.length < 2) ? '0' + second : second;

  // Formatting Date
  let dateArray = [];
  let dateSeparator = '-';
  let splitdate = output_format.split(/[^a-z]/gi);
  if (splitdate.length < 3) {
    return 'invalid format';
  }

  let get_separator = output_format.split(/[\w]/gi);

  for (var i = 0; i < splitdate.length; i++) {
    if (splitdate[i] == 'Y' || splitdate[i] == 'y') {
      dateArray.push(year);
    } else if (splitdate[i] == 'M' || splitdate[i] == 'm' || splitdate[i] == 'f' || splitdate[i] == 'F') {
      switch (splitdate[i]) {
        case 'M':
          month = lang('month_short.' + month);
          break;
        case 'f':
          month = lang('month_long.' + month);
          break;
        case 'F':
          month = lang('month_long.' + month);
          break;
      }

      dateArray.push(month);
    } else if (splitdate[i] == 'D' || splitdate[i] == 'd') {
      dateArray.push(day);
    }
  }

  let newDateSeparator = get_separator.filter(String);
  if (newDateSeparator.length > 0) {
    dateSeparator = newDateSeparator[0];
  }

  let newdatetime = dateArray.join(dateSeparator);
  if (time !== false) {
    newdatetime += ' ' + [hour, minute, second].join(':');
  }

  if (getDate === false) {

    let fullTime = [hour, minute, second].join(':');

    return fullTime;

  } else {

    return newdatetime;
  }

}

export function formatDate2(date = [], setDay = true) {

  if (!date)
    date = moment().toDate();
  else
    date = moment(date).toDate();

  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var dayNames = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday",
    "Saturday"
  ]

  var dayIndex = date.getDay();
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  if (setDay) {

    return dayNames[dayIndex] + ', ' + day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  return day + ' ' + monthNames[monthIndex] + ' ' + year;

}

/**
 * to Calculate two date differences
 *
 * @param {string} newerDate - Newer Date
 * @param {string} olderDate - Older date
 * @param {string} unit - Output time unit (default 'second')
 * @param {boolean} withRemarks - Options for remark, will return string with remarks
 *
 * @return {integer/string} Date differences in unit
 */
export function calcDateDiff(newerDate, olderDate, unit = 'second', withRemarks = false) {
  // Convert date String into JS Date Object via moment
  newerDate = moment(newerDate).toDate();
  olderDate = moment(olderDate).toDate();
  let result = (newerDate.getTime() - olderDate.getTime()); // Differences in millisecond
  let langIndex = `time.${unit}`;

  switch (unit) {
    case 'millisecond':
      result = result;
    case 'minute':
      result = result / secondInMinutes;
    case 'hour':
      result = result / minutesInHour;
    case 'day':
      result = result / hourInDay;
    case 'week':
      result = result / dayInWeeks;
    case 'month':
      result = result / weekInMonths;
    case 'year':
      result = result / monthInYear;
    default:
      result = result / milInSecond;
  }

  if (withRemarks === true) {
    let remark = `${Math.round(result)} ${lang(langIndex)}`;
    if (result > 1)
      remark += 's';

    return remark;
  } else {
    return result;
  }
}

/**
 * to Print Post Date
 * Get age of post date
 *
 * @param {string} postDate - Post created date
 * @param {boolean} withRemarks - Options for remark, will return string with remarks
 *
 * @return {string} Results of post date age
 */
export function printPostDate(postDate, withRemarks = true) {
  let datenow = getFormatDate();
  let result = calcDateDiff(datenow, postDate);

  // Time Group, order from the smallest into biggest unit
  let timeGroup = {
    'second': secondInMinutes,
    'minute': minutesInHour,
    'hour': hourInDay,
    'day': dayInWeeks,
    'week': weekInMonths
  };

  if (result < 0) {
    // *** Post Date is in the Future *** //
    // remove the minus sign
    result = Math.abs(result);

    for (var unit in timeGroup) {
      if (result <= timeGroup[unit]) {
        let langIndex = (result > 1) ? `time_later.${unit}s` : `time_later.${unit}`;
        result = `${Math.round(result)} ${lang(langIndex)}`;

        break;
      }

      // Divide result into the next unit
      result = result / timeGroup[unit];
    }
  } else {
    // *** Post Date is in the Past *** //
    for (var unit in timeGroup) {
      if (result <= timeGroup[unit]) {
        let langIndex = (result > 1) ? `time_ago.${unit}s` : `time_ago.${unit}`;
        result = `${Math.round(result)} ${lang(langIndex)}`;

        break;
      }

      // Divide result into the next unit
      result = result / timeGroup[unit];
    }
  }

  // *** Others *** //
  if (withRemarks === true && typeof result === 'number') {
    // if result is more than 4 weeks
    return getFormatDate(moment(postDate).toDate(), false, 'd F Y');
  } else {
    return result;
  }
}

/**
 * Get Month String
 *
 * @param {integer} monthInInteger - Month in Integer
 * @param {string} type - Month output format (long | short)
 *
 * @return {string} Month output
 */
export function getMonthString(monthInInteger = null, type = 'long') {
  if (monthInInteger === null) {
    monthInInteger = moment.format('m');
  }

  monthInInteger = monthInInteger.toString();
  let month = monthInInteger <= 9 ? '0' + monthInInteger : monthInInteger;

  return lang(`month_${type}.${month}`);
}

// to Filter Array of Object and return new array fill by filtered value
export function filterArray(arrayOfObject: Array, filter: Object, count: Boolean = false) {
  let newArray = arrayOfObject.filter(
    (obj) => filterCallback(obj, filter)
  );

  if (count === true) {
    return newArray.length || 0;
  } else {
    return newArray || [];
  }
}

function filterCallback(obj, filter) {
  let tempResult = false;

  for (var key in filter) {
    if (filter.hasOwnProperty(key)) {
      let isNegation = /^!./.test(filter[key]);
      let newValue = filter[key].toString();
      newValue = newValue.replace("!", ""); // Remove negation code (!)

      if (isNegation && obj[key] != newValue) {
        tempResult = true;
      } else if (!isNegation && obj[key] == filter[key]) {
        tempResult = true;
      } else {
        tempResult = false;
        break;
      }
    } else {
      tempResult = false;
      break;
    }
  }

  return tempResult;
}

export function getTime(date, withSeconds = false) {
  date = date.split(' ');
  let time = date[1];
  let newdate = date[0];

  if (withSeconds == false) {
    time = time.slice(0, -3, '');
  }

  return time;
}

export function getIndexOf(arrayOfObject, filter) {
  let index = arrayOfObject.findIndex((person) => {
    let filterKey = Object.keys(filter)[0];
    return person[filterKey] == filter[filterKey];
  });

  return index;
}

export function popArray(arrayOfObject, filter) {
  let getIndex = getIndexOf(arrayOfObject, filter);
  if (getIndex !== -1) {
    let removedElem = arrayOfObject.splice(getIndex, 1);
    let returnValue = {
      new_array: arrayOfObject,
      removedElem
    }
    return returnValue;
  } else {
    let returnValue = {
      new_array: arrayOfObject,
      removedElem: {}
    }
    return returnValue;
  }
}

export function pushObj(currentArray = [], newObject, pushOnTop = false) {
  if (!Array.isArray(newObject)) {
    newObject = [newObject]; // put newObject to Array
  }

  if (pushOnTop != true) {
    return currentArray.concat(newObject);
  } else {
    return newObject.concat(currentArray);
  }
}

export function getWaitingTime() {
  // is JS Remote Debug enabled?
  const isDebuggingEnabled = isJSDebugEnable;
  if (isDebuggingEnabled === true) {
    return waitDebug;
  } else {
    return waitProd;
  }
}

/**
 * Format Currency
 * @param {Float/Int} price - contains number to be fomatted
 * @param {String} currency - currency, default is IDR
 * @param {Int} dec_digit - amount of decimal digit
 * @return {String} - Result of formatted currency
 */
export function formatCurrency(
  price,
  currency = 'IDR',
  dec_digit = 0,
  translateToWords = false,
) {
  let dec_sep;
  let th_sep;
  let currency_symbol;

  switch (currency) {
    case 'IDR':
      currency_symbol = 'Rp ';
      dec_sep = ',';
      th_sep = '.';
      break;
    case 'USD':
      currency_symbol = '$';
      dec_sep = '.';
      th_sep = ',';
      break;
    default:
      currency_symbol = (currency) ? currency + " " : '';
      dec_sep = ',';
      th_sep = '.';
      break;
  }

  let n = price,
    c = dec_digit,
    d = dec_sep,
    t = th_sep,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;

  let res = currency_symbol + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - parseInt(i)).toFixed(c).slice(2) : "");

  if (!translateToWords) {
    return res;
  }
  else {
    return this.translatePriceToWordsIDR(res.toString());
  }
}

export function translatePriceToWordsIDR(price) {
  let text = ['', '', 'Ribu', 'Juta', 'Milyar', 'Trilyun'];

  price = price.toString();
  price = price.split('.');

  let calcHundred = Math.round(price[1] / 100);
  calcHundred == 0 ?
    calcHundred = '' :
    calcHundred = ',' + calcHundred.toString();

  let newPrice = price[0] +
    (price.length > 1 ? calcHundred : "") +
    " " + text[price.length]
    ;

  return newPrice;
}

export function formValidation(formData, requiredData) {
  let passed = true;

  for (var field of requiredData) {
    if (!formData.hasOwnProperty(field) || !formData[field]) {
      passed = false;
      break;
    }
  }

  if (passed === false) {
    Alert.alert(
      `${lang('title.form_validation')}`,
      `${lang(`label.${field}`)} ${lang('error.input_required')}`
    );
  }

  return passed;
}

export function loadDefaultWebView() {
  let html = `<html>Testing From Hooks</html>`;

  return html;
}

/**
 * Remove HTML Tags from text
 * @param {string} text - Text to be filtered
 * @return {string} Text after filtered
 */
export function stripHTMLTags(text) {
  let regex = /<[^>]*>/g;
  return text.replace(regex, '');
}

export function normalize(size) {
  if (pixelRatio >= 2 && pixelRatio < 3) {
    // iphone 5s and older Androids
    if (deviceWidth < 360) {
      return size * 0.95;
    }

    // iphone 5
    if (deviceHeight < 667) {
      return size;
      // iphone 6-6s
    }

    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.15;
    }
    // older phablets
    return size * 1.25;
  }

  if (pixelRatio >= 3 && pixelRatio < 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (deviceWidth <= 360) {
      return size;
    }

    // Catch other weird android width sizings
    if (deviceHeight < 667) {
      return size * 1.15;
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }

    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.2;
    }

    // catch larger devices
    // ie iphone 6s plus / 7 plus / mi note 等等
    return size * 1.27;
  }

  if (pixelRatio >= 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (deviceWidth <= 360) {
      return size;
      // Catch other smaller android height sizings
    }

    if (deviceHeight < 667) {
      return size * 1.2;
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }

    if (deviceHeight >= 667 && deviceHeight <= 735) {
      return size * 1.25;
    }

    // catch larger phablet devices
    return size * 1.4;
  }

  return size;
}

/** function base64 */
export function encode(input) {
  var output = "";
  var chr1, chr2, chr3 = "";
  var enc1, enc2, enc3, enc4 = "";
  var i = 0;

  do {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }

    output = output +
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4);
    chr1 = chr2 = chr3 = "";
    enc1 = enc2 = enc3 = enc4 = "";
  } while (i < input.length);

  return output;
}

export function decode(input) {

  var output = "";
  var chr1, chr2, chr3 = "";
  var enc1, enc2, enc3, enc4 = "";
  var i = 0;

  // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
  var base64test = /[^A-Za-z0-9\+\/\=]/g;
  if (base64test.exec(input)) {
    window.alert("Sorry Data Not Match");
  }
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

  do {
    enc1 = keyStr.indexOf(input.charAt(i++));
    enc2 = keyStr.indexOf(input.charAt(i++));
    enc3 = keyStr.indexOf(input.charAt(i++));
    enc4 = keyStr.indexOf(input.charAt(i++));

    chr1 = (enc1 << 2) | (enc2 >> 4);
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    chr3 = ((enc3 & 3) << 6) | enc4;

    output = output + String.fromCharCode(chr1);

    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2);
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3);
    }

    chr1 = chr2 = chr3 = "";
    enc1 = enc2 = enc3 = enc4 = "";

  } while (i < input.length);

  return output;

}
/** end function base64 */

export function normalizeStyle(size) {
  const { width, height } = Dimensions.get('window');

  let id = deviceWidth;

  if (deviceWidth >= 500) {
    id = 500;
  }

  let globWidth = parseInt((Platform.OS == 'ios') ? 320 : 360);
  // for iOS based on iPhone 5 width (320)
  // for Android based on under 5" screen width (240)
  let scale = id / globWidth;
  let newSize = size * scale;
  // let result;
  // if(Platform.OS == 'ios')
  //   result = Math.round(PixelRatio.roundToNearestPixel(newSize));
  // else
  //   result = Math.round(PixelRatio.roundToNearestPixel(newSize))-2;

  // consoleLog("STYLE HELPER", { size, newSize, scale, result });
  return newSize;
}

export function getDateString(date, format = 'dddd, Do MMM YYYY') {
  let rawDate = moment(date).toDate();
  const formattedDate = moment(rawDate).format(format);
  return formattedDate;
};

export function isIphoneXorAbove() {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
  );
}

/**
 * calculateDistance
 * Function to calculate distance between 2 point, result in Kilometer (Km)
 * @param {JSONObject} start - contains lat and lng of start point
 * @param {JSONObject} target - contains lat and lng of target point
 * @return {Number} - Result of calculatedDistance in Kilometer (Km)
 */
export function calculateDistance(start, target) {
  let Rk = 6373; // mean radius of the earth (km) at 39 degrees from the equator

  let start_lat = start.lat;
  let start_lng = start.lng;

  let trg_lat = target.lat;
  let trg_lng = target.lng;

  // convert coordinates to radians
  let lat1 = start_lat * Math.PI / 180; // radians = degrees * pi/180;
  let lng1 = start_lng * Math.PI / 180; // radians = degrees * pi/180;
  let lat2 = trg_lat * Math.PI / 180; // radians = degrees * pi/180;
  let lng2 = trg_lng * Math.PI / 180; // radians = degrees * pi/180;

  // find the differences between the coordinates
  let dlat = lat2 - lat1;
  let dlng = lng2 - lng1;

  // here's the heavy lifting
  let a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlng / 2), 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // great circle distance in radians
  let dk = c * Rk; // great circle distance in km

  // round the results down to the nearest 1/100
  let km = Math.round(dk * 100) / 100;

  let distance = km;

  return distance;
}

/**
 * sentenceCase
 * Function to format string to Sentence case (First letter with capital)
 * @param {String} str - string source that want to be formatted
 * @return {String} - result sentence string
 */
export function sentenceCase(str) {
  str = str.toLowerCase();
  return str.replace(/[a-z]/i, (letter) => {
    return letter.toUpperCase();
  }).trim();
}

/**
 * get file name from full path
 * Function to parse full path and return the file name
 * @param {String} str - string source contain full url
 * @return {String} - result file name with extensions
 */
export function getFileNameFromPath(str) {
  return str.split('\\').pop().split('/').pop();
}

/**
 * Global alert handler
 * @param {String} message - string source contain alert message
 * @param {String} type - string source contain type of alert (default, error, info)
 * @param {String} customTitle - string source contain custom alert title
 * @param {Array} customButton - Array contains alert buttons
 * @return {Void} - alert dialog
 */
export function alertHandler(
  message,
  type = 'default',
  customTitle = '',
  customButton = []
) {
  let alertTitle = '';

  switch (type) {
    case 'info':
      alertTitle = lang('title.alert_title_info');
      break;
    case 'error':
      alertTitle = lang('title.alert_title_error');
      break;
    case 'default':
      alertTitle = lang('title.alert_title_default');
      break;
    case 'custom':
      alertTitle = customTitle;
      break;
    default:
      alertTitle = lang('title.alert_title_default');
      break;
  }

  let timerUp = setTimeout(() => {
    Alert.alert(
      alertTitle,
      message,
      Array.isArray(customButton) && customButton.length ?
        customButton :
        // default button OK
        [{
          text: 'OK', onPress: () => {
            console.log('default Global Alert OK Pressed!');
          }
        }],
      { cancelable: false }
    );
  }, this.getWaitingTime());
}

/**
 * Sort JSON Array by property
 * @param {Array} objArray - JSON Array object
 * @param {String} prop - prop for JSON sorted by
 * @param {String} direction - direction for sorted array
 * @return {Array} - final JSON Array object sorted by property
 */
export function JSONsortByProperty(objArray, prop, direction) {
  if (arguments.length < 2) throw new Error("ARRAY, AND OBJECT PROPERTY MINIMUM ARGUMENTS, OPTIONAL DIRECTION");
  if (!Array.isArray(objArray)) throw new Error("FIRST ARGUMENT NOT AN ARRAY");
  const clone = objArray.slice(0);
  const direct = arguments.length > 2 ? arguments[2] : 1; //Default to ascending
  const propPath = (prop.constructor === Array) ? prop : prop.split(".");
  clone.sort(function (a, b) {
    for (let p in propPath) {
      if (a[propPath[p]] && b[propPath[p]]) {
        a = a[propPath[p]];
        b = b[propPath[p]];
      }
    }
    // convert numeric strings to integers
    a = a.toString().match(/^\d+$/) ? +a : a;
    b = b.toString().match(/^\d+$/) ? +b : b;
    return ((a < b) ? -1 * direct : ((a > b) ? 1 * direct : 0));
  });
  return clone;
}