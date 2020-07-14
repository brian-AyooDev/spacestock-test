import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View
} from 'react-native';

import {
  Body,
  Container,
  Content,
  Header,
  Icon,
  Text,
  Title,
  Right,
  Left,
} from 'native-base';

import { propTypes } from 'prop-types';

import * as Styles from 'App/Styles';

let headerButtonFlex = 0.15;

export default class AppFrame extends Component {
  static navigationOptions = () => ({ headerShown: false });

  constructor() {
    super();

    this.state = {
      headerColor: Styles.Colors.primary,
      headerTitleFlex: 1
    }
  }

  componentDidMount() {
    this._calcFlex();
  }

  _calcFlex() {
    this.setState((previouseState) => {
      let titleFlex = previouseState.headerTitleFlex;

      if (this.props.headerLeft)
        titleFlex = titleFlex - headerButtonFlex;
      if (this.props.headerRight)
        titleFlex = titleFlex - headerButtonFlex;

      return { headerTitleFlex: titleFlex };
    });
  }

  renderHeader() {
    if (Platform.OS == 'ios') {
      return (
        <Header
          androidStatusBarColor={this.state.headerColor}
          style={[{ backgroundColor: this.state.headerColor }, this.props.headerStyle]}
        >
          <Left>
            {this.props.headerLeft}
          </Left>
          <Body>
            <Title>{this.props.headerTitle}</Title>
          </Body>
          <Right>
            {this.props.headerRight}
          </Right>
        </Header>
      );
    } else {
      return (
        <Header
          androidStatusBarColor={this.state.headerColor}
          style={[{ backgroundColor: this.state.headerColor }, this.props.headerStyle]}
        >
          {this.props.headerLeft &&
            <Left style={{ flex: headerButtonFlex }}>
              {this.props.headerLeft}
            </Left>
          }
          <Body style={{ flex: this.state.headerTitleFlex }}>
            <Title>{this.props.headerTitle}</Title>
          </Body>
          {this.props.headerRight &&
            <Right style={{ flex: headerButtonFlex }}>
              {this.props.headerRight}
            </Right>
          }
        </Header>
      );
    }
  }

  render() {
    return (
      <Container>
        {this.renderHeader()}
        {this.props.renderContent}
      </Container>
    );
  }
}
