import React, { Component } from "react";
import configureStore from 'App/Components/Redux/Store';
import { Provider } from 'react-redux';
import AppNavigator from 'App/Navigations/Navigator';
import { Root } from 'native-base';
import {
  setCustomText,
  setCustomTextInput,
  setCustomTouchableOpacity,
} from 'react-native-global-props';
import * as Styles from 'App/Styles';

export default class App extends Component {
  constructor() {
    super();
    // Create Store Redux
    this.store = configureStore({});
    this.setGlobalProps();
  }

  setGlobalProps() {
    const customProps = {
      allowFontScaling: false,
      style: {
        color: Styles.Colors.black,
      }
    };

    const customPropsTouchableOpacity = {
      delayPressIn: 0
    };

    setCustomText(customProps);
    setCustomTextInput(customProps);
    setCustomTouchableOpacity(customPropsTouchableOpacity);
  }

  render() {
    return (
      <Root>
        <Provider store={this.store}>
          <AppNavigator />
        </Provider>
      </Root>
    );
  }
}
