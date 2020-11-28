
/*

how to use:

1) import component
2) set activeSwitch=1 to state
3) use <MySwitchButton  onValueChange={(val) => this.setState({ ttttt: val })} /> in your code
4) use { this.state.activeSwitch === 1 ? view1 : view2 }

small example: ...


    constructor () {
        super();

        this.state = {
          activeSwitch: 1
        };
    }


    render () {

        return (

            <View>
                <SwitchButton
                    onValueChange={(val) => this.setState({ activeSwitch: val })}      // this is necessary for this component
                    text1 = 'ON'                        // optional: first text in switch button --- default ON
                    text2 = 'OFF'                       // optional: second text in switch button --- default OFF
                    switchWidth = {100}                 // optional: switch width --- default 44
                    switchHeight = {44}                 // optional: switch height --- default 100
                    switchdirection = 'rtl'             // optional: switch button direction ( ltr and rtl ) --- default ltr
                    switchBorderRadius = {100}          // optional: switch border radius --- default oval
                    switchSpeedChange = {500}           // optional: button change speed --- default 100
                    switchBorderColor = '#d4d4d4'       // optional: switch border color --- default #d4d4d4
                    switchBackgroundColor = '#fff'      // optional: switch background color --- default #fff
                    btnBorderColor = '#00a4b9'          // optional: button border color --- default #00a4b9
                    btnBackgroundColor = '#00bcd4'      // optional: button background color --- default #00bcd4
                    fontColor = '#b1b1b1'               // optional: text font color --- default #b1b1b1
                    activeFontColor = '#fff'            // optional: active font color --- default #fff
                />
            </View>

        );
    }


*/

import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated
} from 'react-native';
import PropTypes from 'prop-types';

export default class SwitchButton extends Component {
  static propTypes = {
    onValueChange: PropTypes.func,
  };

  static defaultProps = {
    onValueChange: () => null
  };

  constructor(props) {
    super(props);

    this.state = {
      activeSwitch: this.props.activeSwitch || this.props.value1,
      sbWidth: 100,
      sbHeight: 44,
      direction: 'ltr',
      offsetX: new Animated.Value(0)
    };

    this._switchDirection = this._switchDirection.bind(this);

    let dirsign = 1;
    if (this.state.direction === 'rtl') {
      dirsign = -1;
    }
    else {
      dirsign = 1;
    }

    if (this.state.activeSwitch != this.props.value1) {
      this.setState({ offsetX: new Animated.Value((((this.props.switchWidth || this.state.sbWidth) / 2) - 6) * dirsign), }, () => {
        this._switchThump(this.props.switchdirection || this.state.direction);
      });
    }
  }

  _switchDirection(direction) {
    let dir = 'row';

    if (direction === 'rtl') {
      dir = 'row-reverse';
    }
    else {
      dir = 'row';
    }
    return dir;
  }

  _switchThump(direction) {
    const { onValueChange } = this.props;
    let dirsign = 1;
    if (direction === 'rtl') {
      dirsign = -1;
    }
    else {
      dirsign = 1;
    }

    if (this.state.activeSwitch === this.props.value1) {
      this.setState({ activeSwitch: this.props.value2 }, () => onValueChange(this.state.activeSwitch));

      Animated.timing(
        this.state.offsetX,
        {
          toValue: (((this.props.switchWidth || this.state.sbWidth) / 2) - 6) * dirsign,
          duration: this.props.switchSpeedChange || 100,
          useNativeDriver: false
        }
      ).start();
    }
    else {
      this.setState({ activeSwitch: this.props.value1 }, () => onValueChange(this.state.activeSwitch));
      Animated.timing(
        this.state.offsetX,
        {
          toValue: 0,
          duration: this.props.switchSpeedChange || 100,
          useNativeDriver: false
        }
      ).start();
    }

  }

  render() {

    return (

      <View>
        <TouchableOpacity activeOpacity={1} onPress={() => { this._switchThump(this.props.switchdirection || this.state.direction) }}>
          <View
            style={[{
              width: this.props.switchWidth || this.state.sbWidth,
              height: this.props.switchHeight || this.state.sbHeight,
              borderRadius: this.props.switchBorderRadius !== undefined ? this.props.switchBorderRadius : this.state.sbHeight / 2,
              borderWidth: 1,
              borderColor: this.props.switchBorderColor || "#d4d4d4",
              backgroundColor: this.props.switchBackgroundColor || "#fff"
            }]}
          >
            <View style={[{ flexDirection: this._switchDirection(this.props.switchdirection || this.state.direction) }]} >

              <Animated.View useNativeDriver={false} style={{ transform: [{ translateX: this.state.offsetX }] }}>
                <View
                  style={[switchStyles.wayBtnActive,
                  {
                    width: this.props.switchWidth / 2 || this.state.sbWidth / 2,
                    height: this.props.switchHeight - 6 || this.state.sbHeight - 6,
                    borderRadius: this.props.switchBorderRadius !== undefined ? this.props.switchBorderRadius : this.state.sbHeight / 2,
                    borderColor: this.props.btnBorderColor || "#00a4b9",
                    backgroundColor: this.props.btnBackgroundColor || "#00bcd4"
                  }]}
                />
              </Animated.View>

              <View style={[switchStyles.textPos,
              {
                width: this.props.switchWidth / 2 || this.state.sbWidth / 2,
                height: this.props.switchHeight - 6 || this.state.sbHeight - 6,
                left: 0
              }]}
              >
                <Text style={[this.state.activeSwitch === this.props.value1 ? { color: this.props.activeFontColor || "#fff" } : { color: this.props.fontColor || "#b1b1b1" }]}>
                  {this.props.text1 || 'ON'}
                </Text>
              </View>

              <View
                style={[switchStyles.textPos,
                {
                  width: this.props.switchWidth / 2 || this.state.sbWidth / 2,
                  height: this.props.switchHeight - 6 || this.state.sbHeight - 6,
                  right: 0
                }]}
              >
                <Text style={[this.state.activeSwitch === this.props.value2 ? { color: this.props.activeFontColor || "#fff" } : { color: this.props.fontColor || "#b1b1b1" }]}>
                  {this.props.text2 || 'OFF'}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        { this.props.children}
      </View>
    );
  }
}

SwitchButton.defaultProps = {
  value1: '1',
  value2: '2',
  setValue: '1',
};

const switchStyles = StyleSheet.create({
  textPos: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rtl: {
    flexDirection: 'row-reverse'
  },
  ltr: {
    flexDirection: 'row'
  },
  wayBtnActive: {
    borderWidth: 1,
    marginTop: 2,
    marginRight: 2,
    marginLeft: 2
  }

});