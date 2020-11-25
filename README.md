# Spacestock Mobile (Test Project)

After Pull:<br>
1. `yarn install`

Additional step (for iOS):<br>
4. `cd ios`
5. `pod install`
6. `cd ..`

7. `react-native run-ios` / `react-native run-android`

Project information:<br>
1. React Native v.0.63.0

Packages Include:<br>
1. [Native Base v.2.13.12](https://nativebase.io)
2. [React Native Vector Icons v.7.0.0](https://github.com/oblador/react-native-vector-icons)
3. [React Navigation v.4.4.0](https://reactnavigation.org/docs/4.x/getting-started)
4. Redux (Includes: react-redux, redux, redux-logger, redux-thunk)
5. [React Native Global Props v1.1.5](https://github.com/Ajackster/react-native-global-props)
6. [React Native Async Storage v1.11.0](https://github.com/react-native-community/async-storage)
7. [React Native DateTimePicker v2.6.0](https://github.com/react-native-community/datetimepicker)
8. [React Native Net Info v5.9.4](https://github.com/react-native-community/netinfo)
9. [Moment.js v2.27.0](https://momentjs.com/)

<!-- Included Examples:<br>
1. Navigator Examples
2. Redux Action & Reducers Example + Redux Store Configuration
3. Separate Styles Example

Custom Libraries:
  * Language Helpers for multi languages app support<br>
  Code Example:<br>

  ```javascript
    /**
     * Load / Display registered label
     */
    ...
    import lang from 'path/to/Helpers/Language';
    ...

    ...
    render() {
      return(
        <Text>{ lang('title.home') }</Text>
      );      
    }
    ...
  ```
  ```javascript
    /**
     * Set current language
     */
    ...
    import { setLanguage } from 'path/to/Helpers/Language';
    ...

    ...
      changeLanguage() {
        setLanguage('id');
      }
    ...
  ```
  ```javascript
    /**
     * Get current language
     */
    ...
    import { getLanguage } from 'path/to/Helpers/Language';
    ...

    ...
      getCurrentLang() {
        let currentLang = getLanguage();
      }
    ...
  ```
    If you want to add another language (eg. French), here the steps:<br>
    1. Create file `fr.js` with JSON variables inside Folder `Helpers/Language`
      ```javascript
        export const encoding = 'fr';
        export const lang = {
          label1: 'Label 1',
          nestedLabel: {
            label2: 'Nested Label 2'
          }
        }
      ```
    2. Import `fr.js` to `Helpers/Language/index.js`
      ```javascript
      import * as french from './fr';
      ```
    3. add `french` into `availLang`'s array
      ```javascript
      export const availLang = [
        ...
        ...
        french
      ];
      ```
    4. Ta da, your new language is available to be displayed

  * Hooks helpers, helper for your own custom functions<br>Code Examples:<br>
  ```javascript
    // Import all
    import * as Hooks from 'path/to/Helpers/Hooks';

    ...
    let myValue = Hooks.yourCustomFunctionName(yourParams);
    let myOtherValue = Hooks.yourOtherCustomFunctionName(yourOtherParams);
    ...

    // Or

    import {
      yourCustomFunctionName,
      yourOtherCustomFunctionName
    } from 'path/to/Helpers/Hooks';

    ...
    let myValue = yourCustomFunctionName(yourParams);
    let myOtherValue = yourOtherCustomFunctionName(yourOtherParams);
    ...
  ```

  * Session Helpers, use to store detail of current session<br>Code Example:<br>
  ```javascript
    // Always Prepare Session when the app is started (usually in Splash Screen)
    import * as Session from 'path/to/Helpers/Session';

    ...
    Session.prepare().then((sessionData) => {
      // Do something with existed sessionData
    }).catch((err) => {
      console.log("Session Prepare Error", err.message);
    });
    ...
  ```
  ```javascript
    // Set Session Value
    ...
    let yourValue = 'my Name is Ajul';
    Session.setValue(Session.YOUR_KEY, yourValue);
    ...
    ```
    ```javascript
    // Get Session Value
    ...
    let myName = Session.getValue(Session.YOUR_KEY, 'default value');
    ...
  ```

  * Http Helpers, to handle Http Requests<br>Usage Example:<br>
  ```javascript
    ...
    import HttpRequest from 'path/to/Helpers/Http';
    ...

    ...
    let myRequest = {
      link: 'myapi/endpoints',
      method: 'POST',
      data: {
        id: 1,
        name: 'my name is'
      }
    }

    HttpRequest(myRequest).then((response) => {
      // Do something with the response
    }).catch((error) => {
      // Do something with the error
    });
    ...
  ``` -->