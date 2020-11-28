import * as Hooks from 'App/Helpers/Hooks';
import lang from 'App/Helpers/Languages';
import * as Session from 'App/Storages/Session';

// SWITCH Production/Development Environment
export const PRODUCTION: string = 'PROD';
export const ALPHA: string = 'ALPHA';
export const INTERNAL: string = 'INTERNAL';
export const LOCAL: string = 'LOCAL';

export const TOWER_IMAGE_URL: string = 'https://res.cloudinary.com/dpqdlkgsz/image/private/t_anteoculatia_reducto/';
export const COMPLEX_IMAGE_URL: string = 'https://res.cloudinary.com/dpqdlkgsz/image/upload/t_alohomora/v1/';

// Change this Value to switch Environment
export const MODE = PRODUCTION;

// The URL
export const URL = 'YOUR_URL_LINK';

export var API = '';
switch (MODE) {
  case PRODUCTION:
    API = URL + 'api/';
    break;

  case ALPHA:
    API = URL + 'api/';
    break;

  case INTERNAL:
    API = URL + 'api/';
    break;

  case LOCAL:
    API = URL + 'api/';
    break;

  default:
    API = URL + 'api/';
    break;
}

export const GOOGLE_API = 'https://maps.googleapis.com/maps/api/geocode/json?';
export const APIKEY = 'YOUR_API_KEY';
const TAG = 'HTTP Helper ';

/**
 * Create Request onto API
 * Inside Params:
 *    - Link {string} link - API endpoints (eg: "api/login")
 *    - Custom Link {string} custom_link - Full Http URL
 *    - Request Method {string} method - Http request method (eg: POST, GET, PUT or etc.)
 *    - Http Data {object} data - Data as Http request body
 *
 * @param {object} params - Contains parameters about Request
 *
 * @return {Promise}
 */
export function createRequest(
  params: Object,
  allDataResponse = false,
  json = true
) {
  return new Promise((resolve, reject) => {
    let full_url = API;
    let message;

    // *** Set HTTP Link *** //
    if (!params.link) {
      if (!params.custom_link) {
        reject({ message: lang('error.url_not_set') });
      }
      else {
        full_url = params.custom_link;
      }
    }
    else {
      full_url += params.link;
    }
    // *** /Set HTTP Link *** //

    let fetchOptions = {};
    // *** Set HTTP Headers *** //
    if (params.headers) {
      fetchOptions.headers = params.headers;
    }
    else {
      fetchOptions.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
    }

    // fetchOptions.headers['Authorization'] = Session.getValue(Session.API_TOKEN, '');
    // *** /Set HTTP Headers *** //

    // *** Set HTTP Method *** //
    if (params.method) {
      fetchOptions.method = params.method;
    }
    else {
      fetchOptions.method = 'GET'; // default is GET
    }
    // *** /Set HTTP Method *** //

    // *** Decide HTTP Data Container *** //
    if (params.data) {
      if (fetchOptions.method === 'GET') {
        let extend_url = [];
        for (var par in params.data) {
          if (params.data.hasOwnProperty(par)) {
            let param_get = par + "=" + params.data[par];
            extend_url = [...extend_url, param_get]; // push new param into extend_url
          }
        }

        full_url += `?${extend_url.join('&')}`;
      }
      else {
        if (/form/.test(fetchOptions.headers['Content-Type'])) {
          // Header type is form, so we need convert the json into Form Data
          // Used for uploading image/file, (Single and Multi)
          let formData = new FormData();
          for (let first_lvl in params.data) {
            if (params.data.hasOwnProperty(first_lvl)) {
              let first_lvl_data = params.data[first_lvl];

              if (Array.isArray(first_lvl_data)) { // Check if object value is an array
                // Multi Files
                for (let second_lvl in first_lvl_data) {
                  let second_lvl_data = first_lvl_data[second_lvl];
                  formData.append(`${first_lvl}[]`, second_lvl_data);
                }
              }
              else {
                // Single File
                formData.append(first_lvl, first_lvl_data);
              }
            }
          }

          fetchOptions.body = formData;
        }
        else {

          if (json === true) {

            fetchOptions.body = JSON.stringify(params.data);
          }
          else {
            fetchOptions.body = params.data;
          }
        }
      }
    }
    // *** /Decide HTTP Data Container *** //

    // if(params.data)
    //   Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" REQUEST to ' + full_url, params.data);
    // else
    //   Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" REQUEST to ' + full_url, '');

    // Set Timeout
    fetchOptions.timeout = 100; // 5000ms

    let response = fetch(full_url, fetchOptions)
      .then((response) => {
        Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" RESPONSE from ' + full_url, response);
        if (response.status === 200) {
          return response.json();
        }
        else {
          if (response.statusText) {
            message = response.statusText;
          }
          else if (response.message) {
            message = response.message;
          }
          else {
            message = lang('error.http_' + response.status);
          }

          reject({ message });
        }
      })
      .then((response) => {
        Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" RESPONSE BODY from ' + full_url, response);
        if (response.status === true || response.error_code === 0) {
          if (allDataResponse) {
            resolve(response);
          }
          else {
            resolve(response.data);
          }
        }
        else {
          if (response.success) {
            resolve(response.success);
          }
          else if (response.message) {
            message = response.message;
          }
          else {
            resolve(response);
            // message = lang('error.http_unknown');
          }
          reject({ message });
        }
      })
      .catch((error) => {
        Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" CATCH \n' + full_url, error);
        reject(error);
      });
  });
}

export function createRequestRTO(
  params: Object,
  allDataResponse = false,
  json = true,
  TIMEOUT: Number = 10000, // 10s
) {
  let timeout_err = {
    message: lang('error.http_408'),
    ok: false,
    error: true,
    status: 408,
  };

  return new Promise((resolve, reject) => {
    let full_url = API;
    let message;

    // *** Set HTTP Link *** //
    if (!params.link) {
      if (!params.custom_link) {
        reject({ message: lang('error.url_not_set') });
      }
      else {
        full_url = params.custom_link;
      }
    }
    else {
      full_url += params.link;
    }
    // *** /Set HTTP Link *** //

    let fetchOptions = {};
    // *** Set HTTP Headers *** //
    if (params.headers) {
      fetchOptions.headers = params.headers;
    }
    else {
      fetchOptions.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
    }

    // fetchOptions.headers['Authorization'] = Session.getValue(Session.API_TOKEN, '');
    // *** /Set HTTP Headers *** //

    // *** Set HTTP Method *** //
    if (params.method) {
      fetchOptions.method = params.method;
    }
    else {
      fetchOptions.method = 'GET'; // default is GET
    }
    // *** /Set HTTP Method *** //

    // *** Decide HTTP Data Container *** //
    if (params.data) {
      if (fetchOptions.method === 'GET') {
        let extend_url = [];
        for (var par in params.data) {
          if (params.data.hasOwnProperty(par)) {
            let param_get = par + "=" + params.data[par];
            extend_url = [...extend_url, param_get]; // push new param into extend_url
          }
        }

        full_url += `?${extend_url.join('&')}`;
      }
      else {
        if (/form/.test(fetchOptions.headers['Content-Type'])) {
          // Header type is form, so we need convert the json into Form Data
          // Used for uploading image/file, (Single and Multi)
          let formData = new FormData();
          for (let first_lvl in params.data) {
            if (params.data.hasOwnProperty(first_lvl)) {
              let first_lvl_data = params.data[first_lvl];

              if (Array.isArray(first_lvl_data)) { // Check if object value is an array
                // Multi Files
                for (let second_lvl in first_lvl_data) {
                  let second_lvl_data = first_lvl_data[second_lvl];
                  formData.append(`${first_lvl}[]`, second_lvl_data);
                }
              }
              else {
                // Single File
                formData.append(first_lvl, first_lvl_data);
              }
            }
          }

          fetchOptions.body = formData;
        }
        else {

          if (json === true) {

            fetchOptions.body = JSON.stringify(params.data);
          }
          else {
            fetchOptions.body = params.data;
          }
        }
      }
    }
    // *** /Decide HTTP Data Container *** //

    // if(params.data)
    //   Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" REQUEST to ' + full_url, params.data);
    // else
    //   Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" REQUEST to ' + full_url, '');

    // Set Timeout
    fetchOptions.timeout = 100; // 5000ms

    let response = fetch(full_url, fetchOptions)
      .then((response) => {
        Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" RESPONSE from ' + full_url, response);
        if (response.status === 200) {
          return response.json();
        }
        else {
          if (response.statusText) {
            message = response.statusText;
          }
          else if (response.message) {
            message = response.message;
          }
          else {
            message = lang('error.http_' + response.status);
          }

          reject({ message });
        }
      })
      .then((response) => {
        Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" RESPONSE BODY from ' + full_url, response);
        if (response.status === true || response.error_code === 0) {
          if (allDataResponse) {
            resolve(response);
          }
          else {
            resolve(response.data);
          }
        }
        else {
          if (response.success) {
            resolve(response.success);
          }
          else if (response.message) {
            message = response.message;
          }
          else {
            resolve(response);
            // message = lang('error.http_unknown');
          }
          reject({ message });
        }
      })
      .catch((error) => {
        Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" CATCH \n' + full_url, error);
        reject(error);
      });

    setTimeout(reject.bind(null, timeout_err), TIMEOUT);
  });
}

export function additional(params: Object, json = true) {
  return new Promise((resolve, reject) => {
    let full_url;
    let message;

    // *** Set HTTP Link *** //
    if (!params.custom_link) {
      full_url = params.link;
    }
    else {
      full_url = params.custom_link;
    }
    // *** /Set HTTP Link *** //

    let fetchOptions = {};
    // *** Set HTTP Headers *** //
    if (params.headers) {
      fetchOptions.headers = params.headers;
    }
    else {
      fetchOptions.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
    }
    // *** /Set HTTP Headers *** //

    // *** Set HTTP Method *** //
    if (params.method) {
      fetchOptions.method = params.method;
    }
    else {
      fetchOptions.method = 'GET'; // default is GET
    }
    // *** /Set HTTP Method *** //

    // *** Decide HTTP Data Container *** //
    if (params.data) {
      if (fetchOptions.method === 'GET') {
        let extend_url = [];
        for (var par in params.data) {
          if (params.data.hasOwnProperty(par)) {
            let param_get = par + "=" + params.data[par];
            extend_url = [...extend_url, param_get]; // push new param into extend_url
          }
        }

        full_url += `?${extend_url.join('&')}`;
      }
      else {
        if (/form/.test(fetchOptions.headers['Content-Type'])) {
          // Header type is form, so we need convert the json into Form Data
          // Used for uploading image/file, (Single and Multi)
          let formData = new FormData();
          for (let first_lvl in params.data) {
            if (params.data.hasOwnProperty(first_lvl)) {
              let first_lvl_data = params.data[first_lvl];

              if (Array.isArray(first_lvl_data)) { // Check if object value is an array
                // Multi Files
                for (let second_lvl in first_lvl_data) {
                  let second_lvl_data = first_lvl_data[second_lvl];
                  formData.append(`${first_lvl}[]`, second_lvl_data);
                }
              }
              else {
                // Single File
                formData.append(first_lvl, first_lvl_data);
              }
            }
          }

          fetchOptions.body = formData;
        }
        else {

          if (json === true) {

            fetchOptions.body = JSON.stringify(params.data);
          }
          else {
            fetchOptions.body = params.data;
          }

        }
      }
    }
    // *** /Decide HTTP Data Container *** //

    // Set Timeout
    fetchOptions.timeout = 100; // 5000ms

    let response = fetch(full_url, fetchOptions)
      .then((response) => {
        Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" RESPONSE from ' + full_url, response);
        if (response.statusText) {
          message = response.statusText;
        }
        else if (response.message) {
          message = response.message;
        }
        else {
          return response.json();
        }
        reject({ message });
      })
      .then((response) => {
        Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" RESPONSE BODY from ' + full_url, response);
        if (response.success) {
          resolve(response.success);
        }
        else if (response.message) {
          message = response.message;
        }
        else {
          resolve(response);
        }
        reject({ message });
      })
      .catch((error) => {
        Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" CATCH \n' + full_url, error);
        reject(error);
      });
  });
}

export function additionalRTO(
  params: Object,
  json = true,
  TIMEOUT: Number = 10000, // 10s
) {
  let timeout_err = {
    message: lang('error.http_408'),
    ok: false,
    error: true,
    status: 408,
  };

  return new Promise((resolve, reject) => {
    let full_url;
    let message;

    // *** Set HTTP Link *** //
    if (!params.custom_link) {
      full_url = params.link;
    }
    else {
      full_url = params.custom_link;
    }
    // *** /Set HTTP Link *** //

    let fetchOptions = {};
    // *** Set HTTP Headers *** //
    if (params.headers) {
      fetchOptions.headers = params.headers;
    }
    else {
      fetchOptions.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
    }
    // *** /Set HTTP Headers *** //

    // *** Set HTTP Method *** //
    if (params.method) {
      fetchOptions.method = params.method;
    }
    else {
      fetchOptions.method = 'GET'; // default is GET
    }
    // *** /Set HTTP Method *** //

    // *** Decide HTTP Data Container *** //
    if (params.data) {
      if (fetchOptions.method === 'GET') {
        let extend_url = [];
        for (var par in params.data) {
          if (params.data.hasOwnProperty(par)) {
            let param_get = par + "=" + params.data[par];
            extend_url = [...extend_url, param_get]; // push new param into extend_url
          }
        }

        full_url += `?${extend_url.join('&')}`;
      }
      else {
        if (/form/.test(fetchOptions.headers['Content-Type'])) {
          // Header type is form, so we need convert the json into Form Data
          // Used for uploading image/file, (Single and Multi)
          let formData = new FormData();
          for (let first_lvl in params.data) {
            if (params.data.hasOwnProperty(first_lvl)) {
              let first_lvl_data = params.data[first_lvl];

              if (Array.isArray(first_lvl_data)) { // Check if object value is an array
                // Multi Files
                for (let second_lvl in first_lvl_data) {
                  let second_lvl_data = first_lvl_data[second_lvl];
                  formData.append(`${first_lvl}[]`, second_lvl_data);
                }
              }
              else {
                // Single File
                formData.append(first_lvl, first_lvl_data);
              }
            }
          }

          fetchOptions.body = formData;
        }
        else {

          if (json === true) {

            fetchOptions.body = JSON.stringify(params.data);
          }
          else {
            fetchOptions.body = params.data;
          }

        }
      }
    }
    // *** /Decide HTTP Data Container *** //

    // Set Timeout
    fetchOptions.timeout = 100; // 5000ms

    let response = fetch(full_url, fetchOptions)
      .then((response) => {
        Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" RESPONSE from ' + full_url, response);
        if (response.statusText) {
          message = response.statusText;
        }
        else if (response.message) {
          message = response.message;
        }
        else {
          return response.json();
        }
        reject({ message });
      })
      .then((response) => {
        Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" RESPONSE BODY from ' + full_url, response);
        if (response.success) {
          resolve(response.success);
        }
        else if (response.message) {
          message = response.message;
        }
        else {
          resolve(response);
        }
        reject({ message });
      })
      .catch((error) => {
        Hooks.consoleLog(TAG + ' "' + fetchOptions.method + '" CATCH \n' + full_url, error);
        reject(error);
      });

    setTimeout(reject.bind(null, timeout_err), TIMEOUT);
  });
}