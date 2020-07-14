/**
 * Session Library
 */
import AsyncStorage from '@react-native-community/async-storage';
import * as Hooks from 'App/Helpers/Hooks';

const TAG = 'Session Helper';
/**
 * Session Keys
 */
/**
 * Session store variables for User Profile
 */
export const IS_LOGIN = "IsLoggedIn";
export const API_TOKEN = "ApiToken";
export const USER_ID = "UserID";
export const USER_NAME = "UserName";
export const USER_PIC = "UserPic";
export const FULL_NAME = "FullName";

/**
 * Session store variables for Other
 */
export const APP_VERSION = "AppVersion";
export const LANG = "Language";

let DATA_SESSION = {};
const SESSION_KEY = '@Session'; // ini sebagai penanda di Asyncstorage bahwa ini adalah variabel untuk session

/**
 * Set Session value by key
 *
 * @param {String} key - Session key to set
 * @param {Any} value - Value of session key
 *
 * @return {Boolean}
 */
export function setValue(key, value) {
  try {
    if (!DATA_SESSION) {
      DATA_SESSION = {};
    }

    DATA_SESSION[key] = value;

    let sessionData = JSON.stringify(DATA_SESSION);
    // Hooks.consoleLog(TAG + ' setValue', 'Key: ' + key, 'Value: ' + value);
    AsyncStorage.setItem(SESSION_KEY, sessionData);
    return true;
  } catch (error) {
    Hooks.consoleLog(TAG + ' setValue Error', error);
    return false;
  }
}

/**
 * Get Session Value based on key
 *
 * @param {String} key - Session Key to get
 * @param {Any} default_value (optional) - return value if the session key is undefined
 *
 * @return {Any} Value of Session key
 */
export function getValue(key, default_value = '') {
  try {
    let value = DATA_SESSION[key];
    // Hooks.consoleLog(TAG + ' getValue', 'Key: ' + SESSION_KEY+key, 'Value: ' + value);
    return value || default_value;
  } catch (e) {
    return default_value;
  }
}

/**
 * @void Destroy Session
 */
export function destroy() {
  DATA_SESSION = {};
  AsyncStorage.removeItem(SESSION_KEY);
}

/**
 * Prepare Session Data
 * @return {Promise}
 */
export function prepare() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(SESSION_KEY).then((value) => {
      DATA_SESSION = JSON.parse(value);
      Hooks.consoleLog(`${TAG} prepare`, DATA_SESSION);
      resolve(DATA_SESSION);
    }).catch((err) => {
      Hooks.consoleLog(`${TAG} prepare Error`, err);
      reject(err);
    });
  });
}
