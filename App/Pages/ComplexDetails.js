import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Body,
  Button,
  Header,
  Icon,
  Left,
  Right,
  Text,
} from 'native-base';
import { SafeAreaView } from 'react-navigation';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AppActions from 'App/Actions';

import fs, { stat } from 'react-native-fs';
import DummyData from 'App/Assets/DummyData';

import * as Styles from 'App/Styles';
import * as Hooks from 'App/Helpers/Hooks';
import * as Http from 'App/Helpers/Http';

import lang from 'App/Helpers/Languages';
import AppFrame from 'App/Components/AppFrame';
import Loader from 'App/Components/Loader';
import Swiper from 'App/Components/Swiper';
// import Swiper_v2 from 'App/Components/Swiper_v2';
import DropDownPicker from 'App/Components/DropDownPicker';
import SwitchButton from 'App/Components/SwitchButton';
import HTML from 'react-native-render-html';

const { width, height } = Dimensions.get('window');
const TAG = "ComplexDetails ";

class ComplexDetails extends Component {
  static navigationOptions = () => ({ headerShown: false });

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      refreshing: false,
    };
  }

  componentDidMount() {
    Hooks.consoleLog(TAG + 'unitType: ', this.props.unitData.unitType);
  }

  renderHeader() {
    return (
      <Header
        style={[
          {
            backgroundColor: Styles.Colors.white
          }
        ]}
      >
        <Left style={[
          Styles.Helpers.center,
          Styles.Helpers.mainSpaceAround,
          {
            flex: 0.15,
          }
        ]}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={[
              Styles.Helpers.center
            ]}
          >
            <Icon
              name={'chevron-left'}
              type={'MaterialCommunityIcons'}
              style={{
                color: Styles.Colors.primary
              }}
            />
          </TouchableOpacity>
        </Left>
        <View style={[
          Styles.Helpers.crossCenter,
          Styles.Helpers.mainCenter,
          { flex: 0.85 }
        ]}>
          <Image
            source={Styles.Images.app_logo}
            style={{
              alignSelf: 'flex-start',
              resizeMode: 'contain',
              width: 150,
            }}
          />
        </View>
      </Header>
    );
  }

  mainRenderComplex() {
    let data = this.props.unitData.data;
    Hooks.consoleLog(TAG + "mainRenderComplex", data);

    return (
      <View style={[
        Styles.Helpers.mainCenter,
      ]}>
        {/* Banner Slider Image Complex */}
        {this._renderBanner(data.images.images_exterior)}

        {/* Complex Name */}
        <Text style={[
          {
            marginHorizontal: 20,
            marginVertical: 10,
            fontSize: 20,
            fontWeight: 'bold'
          }
        ]}>
          {data.name}
        </Text>

        {/* Price */}
        <Text style={{
          fontSize: 15,
          color: Styles.Colors.grayDark,
          fontSize: 12,
          // marginBottom: 5,
          marginHorizontal: 20,
        }}>
          {'Mulai'}
        </Text>
        <Text style={[
          {
            marginHorizontal: 20,
            marginTop: 5,
            marginBottom: 10,
            fontSize: 15,
            fontWeight: 'bold'
          }
        ]}>
          {Hooks.formatCurrency(data.aggregation.unit[0].value)}
          {
            this.props.searchConfig.searchType != Hooks.BUY_TYPE ?
              <Text style={{ justifyContent: 'center', fontSize: 12 }}>{' / bulan'}</Text> :
              null
          }
        </Text>

        {/* Address */}
        <View style={[
          Styles.Helpers.row,
          {
            marginHorizontal: 20,
          }
        ]}>
          <Icon
            name={'map-marker'}
            type={'MaterialCommunityIcons'}
            style={{
              color: Styles.Colors.grayDark,
              fontSize: 12,
            }}
          />
          <Text style={{
            color: Styles.Colors.grayDark,
            fontSize: 12,
            marginBottom: 5,
          }}>
            {data.address_street}
          </Text>
        </View>

        {/* Details Complex */}
        {this._renderComplexDetails(data)}

        {/* Complex Surrounding Area */}
        <Text style={[
          {
            marginHorizontal: 20,
            marginTop: 30,
            marginBottom: 10,
            fontSize: 16,
            fontWeight: 'bold'
          }
        ]}>
          {'Area Sekitar'}
        </Text>
        {this._renderSurroundingArea(data.surrounding_area)}

        {/* Complex Facility */}
        <Text style={[
          {
            marginHorizontal: 20,
            marginTop: 30,
            marginBottom: 10,
            fontSize: 16,
            fontWeight: 'bold'
          }
        ]}>
          {'Fasilitas'}
        </Text>
        {this._renderComplexFacility(data.facilities)}

        {/* Interior */}
        {
          data.images.images_interior != null &&
          <View>
            <Text style={[
              {
                marginHorizontal: 20,
                marginTop: 30,
                marginBottom: 10,
                fontSize: 16,
                fontWeight: 'bold'
              }
            ]}>
              {'Interior'}
            </Text>
            {this._renderBanner(data.images.images_interior, 'landscape')}
          </View>
        }

        {/* Floorplan */}
        {
          data.images.images_floorplan != null &&
          <View>
            <Text style={[
              {
                marginHorizontal: 20,
                marginTop: 30,
                marginBottom: 10,
                fontSize: 16,
                fontWeight: 'bold'
              }
            ]}>
              {'Floorplan'}
            </Text>
            {this._renderBanner(data.images.images_floorplan, 'landscape')}
          </View>
        }
      </View>
    );
  }

  _renderBanner(
    images,
    style = 'landscape',
    type = Http.TOWER_IMAGE_URL
  ) {
    let portrait = (4 / 3);
    let landscape = (3 / 4);

    let bannerComp = [];

    if (images == null) {
      return (null);
    }

    for (let [index, item] of images.entries()) {
      bannerComp.push(
        <ImageBackground
          key={index + item.alternate_text}
          source={
            item.url.match(/http/g) !== null ?
              { uri: item.url } || Styles.Images.user_default :
              { uri: type + item.url } || Styles.Images.user_default
          }
          style={{
            background: 'lightgray',
            resizeMode: 'cover',
            width,
            height: width * (style == 'portrait' ? portrait : landscape)
          }}
        />
      );
    }

    return (
      <Swiper
        showsButtons={false}
        showsPagination={true}
        loop={true}
        style={{
          height: width * (style == 'portrait' ? portrait : landscape)
        }}
      >
        {bannerComp}
      </Swiper>
    );
  }

  _renderComplexDetails(data) {
    let details = [
      { id: 0, label: 'Developer', value: data.developer_name },
      // { id: 1, label: 'Unit Tersedia', value: data.floor_count },
      { id: 2, label: 'Jumlah Tower', value: data.tower_total },
      // { id: 3, label: 'Luas Lantai', value: data.average_floor_plate + ' sqm' },
    ];

    let detailsComp = [];

    for (let [index, item] of details.entries()) {
      detailsComp.push(
        <View
          key={index + item.label}
          style={[
            Styles.Helpers.center,
            Styles.Helpers.row,
          ]}
        >
          <View style={[
            Styles.Helpers.center
          ]}>
            <Text
              numberOfLines={2}
              ellipsizeMode={'middle'}
              style={[{
                fontWeight: 'bold',
                fontSize: 12
              }]}
            >
              {item.label}
            </Text>
            <Text
              numberOfLines={2}
              ellipsizeMode={'middle'}
              style={[{
                fontSize: 11,
                paddingTop: 3,
              }]}
            >
              {item.value}
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={[
        Styles.Helpers.row,
        Styles.Helpers.mainSpaceAround,
        Styles.Helpers.crossCenter,
        {
          backgroundColor: Styles.Colors.whiteSmoke,
          margin: 10,
          padding: 10,
          borderRadius: 10,
        }
      ]}>
        {detailsComp}
      </View>
    );
  }

  _renderComplexFacility(facility) {
    let facilComp = [];

    for (let item in facility) {
      facilComp.push(
        <View
          key={item}
          style={[
            Styles.Helpers.row,
            Styles.Helpers.crossCenter,
            {
              width: (width / 2) - 50,
              margin: 5,
            }
          ]}
        >
          <Icon
            name={'check'}
            type={'MaterialCommunityIcons'}
            style={{
              color: Styles.Colors.primary,
              fontSize: 15,
              marginRight: 10,
            }}
          />
          <Text style={{
            fontSize: 11,
            textTransform: 'capitalize'
          }}>
            {item.toString().replace('_', ' ')}
          </Text>
        </View>
      );
    }
    return (
      <View style={[
        Styles.Helpers.row,
        Styles.Helpers.mainSpaceBetween,
        Styles.Helpers.crossCenter,
        {
          flexWrap: 'wrap',
          backgroundColor: Styles.Colors.whiteSmoke,
          margin: 10,
          padding: 10,
          borderRadius: 10,
        }
      ]}>
        {facilComp}
      </View>
    );
  }

  _renderSurroundingArea(surroundingArea) {
    let component = [];

    for (let item in surroundingArea) {
      component.push(
        <View
          key={item}
          style={[
            Styles.Helpers.row,
            Styles.Helpers.crossCenter,
            {
              width: (width / 2) - 50,
              margin: 5,
            }
          ]}
        >
          <Icon
            name={'google-maps'}
            type={'MaterialCommunityIcons'}
            style={{
              color: Styles.Colors.primary,
              fontSize: 15,
              marginRight: 10,
            }}
          />
          <Text style={{
            fontSize: 11,
            textTransform: 'capitalize'
          }}>
            {item.toString().replace('_', ' ')}
          </Text>
        </View>
      );
    }
    return (
      <View style={[
        Styles.Helpers.row,
        Styles.Helpers.mainSpaceBetween,
        Styles.Helpers.crossCenter,
        {
          flexWrap: 'wrap',
          backgroundColor: Styles.Colors.whiteSmoke,
          margin: 10,
          padding: 10,
          borderRadius: 10,
        }
      ]}>
        {component}
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView
        style={[
          Styles.Helpers.fill,
          {
            backgroundColor: Styles.Colors.white,
            width,
          }
        ]}
        forceInset={{ top: 'never' }}
      >
        {this.renderHeader()}

        <ScrollView
          bounces={false}
        >
          <Loader loading={this.state.isLoading} />
          {this.mainRenderComplex()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  refresh_app: state.refresh_app,
  unitData: state.unitData,
  searchConfig: state.searchConfig,
});

const mapDispatchToProps = dispatch => bindActionCreators(AppActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ComplexDetails);
