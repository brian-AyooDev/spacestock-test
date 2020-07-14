import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class Splash extends Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.navigate('Home');
    }, 3500);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Splash Screen</Text>
        <ActivityIndicator />
      </View>
    );
  }
}

export default Splash;
