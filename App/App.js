import React, { Component } from "react";
import configureStore from 'App/Components/Redux/Store';
import { Provider } from 'react-redux';
import AppNavigator from 'App/Navigations/Navigator';
import { Root } from 'native-base';

export default class App extends Component {
  constructor() {
    super();
    // Create Store Redux
    this.store = configureStore({});
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
