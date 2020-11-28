import React, { Component } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIndicator } from 'react-native-indicators';
import * as Hooks from 'App/Helpers/Hooks';
import * as Styles from 'App/Styles';

const TAG = 'Loader';

function Textload(textItems) {

  if (textItems) {

    return (
      <Text style={{
        color: 'white',
        fontWeight: 'bold'
      }}>{textItems}</Text>
    );

  } else {
    return null;
  }

}

const Loader = props => {
  const {
    loading,
    textItems,
    ...attributes
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => { Hooks.consoleLog(TAG + 'close modal') }}>
      <View style={styles.modalBackground}>
        <View style={[
          Styles.MainStyles.boxShadow2,
          styles.activityIndicatorWrapper
        ]}>
          <MaterialIndicator
            color={Styles.Colors.primary}
            size={35}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    // backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: Styles.Colors.white,
    height: 65,
    width: 65,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default Loader;
