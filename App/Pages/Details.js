import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppActions from 'App/Actions';
import * as Styles from 'App/Styles';
import * as Hooks from 'App/Helpers/Hooks';
import TowerDetails from 'App/Pages/TowerDetails';
import ComplexDetails from 'App/Pages/ComplexDetails';

const TAG = "Details ";

class Details extends Component {
  static navigationOptions = () => ({ headerShown: false });

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={[
          Styles.Helpers.fill,
        ]}
      >
        {
          this.props.unitData.unitType == Hooks.OFFICE ?
            <TowerDetails navigation={this.props.navigation} /> :
            <ComplexDetails navigation={this.props.navigation} />
        }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  refresh_app: state.refresh_app,
  unitData: state.unitData,
});

const mapDispatchToProps = dispatch => bindActionCreators(AppActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Details);
