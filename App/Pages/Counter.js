import React, { Component } from 'react';
import {
  Text,
  View
} from 'react-native';
import {
  Button,
  Icon
} from 'native-base';

/**
 * Redux
 */
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppActions from 'App/Actions';

import * as Styles from 'App/Styles';
import AppFrame from 'App/Components/AppFrame';

class Counter extends Component {
  static navigationOptions = () => ({ headerShown: false });

  render() {
    return (
      <AppFrame
        headerLeft={
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon name="chevron-left" type="FontAwesome" />
          </Button>
        }

        renderContent={
          <View style={Styles.MainStyles.container}>
            <View style={{ flexDirection: 'row' }}>
              <Button danger small onPress={() => this.props.counterStrike(false)}>
                <Icon name="minus" type="FontAwesome" />
              </Button>
              <Button success small onPress={() => this.props.counterStrike(true)}>
                <Icon name="plus" type="FontAwesome" />
              </Button>
            </View>
            <Text>Counter {this.props.counter}</Text>
          </View>
        }
      />
    );
  }
}

const mapStateToProps = state => ({
  counter: state.counter,
  refresh_app: state.refresh_app
});

const mapDispatchToProps = dispatch => bindActionCreators(AppActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
