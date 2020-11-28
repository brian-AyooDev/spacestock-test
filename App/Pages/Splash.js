import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Styles from 'App/Styles';
const { width, height } = Dimensions.get('window');

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
    }, 800);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          fadeDuration={0}
          source={Styles.Images.app_logo}
          style={{
            position: 'absolute',
            resizeMode: 'contain',
            width: width / 2,
            height: height / 2,
          }}
        />
        <View style={{
          marginTop: width * 0.5
        }}>
          <ActivityIndicator />
        </View>
      </View>
    );
  }
}

export default Splash;
