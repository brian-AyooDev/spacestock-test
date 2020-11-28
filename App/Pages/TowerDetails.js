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
const TAG = "TowerDetails ";

class TowerDetails extends Component {
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

  mainRenderTower() {
    let data = this.props.unitData.data;
    Hooks.consoleLog(TAG + "mainRenderTower", data);

    return (
      <View style={[
        Styles.Helpers.mainCenter,
      ]}>
        {/* Banner Slider Image Tower */}
        {this._renderBanner(data.images.images_exterior)}

        {/* Tower Name */}
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
            {data.aggregation.address.street}
          </Text>
        </View>

        {/* Price */}
        <Text style={[
          {
            marginHorizontal: 20,
            marginVertical: 10,
            fontSize: 15,
            fontWeight: 'bold'
          }
        ]}>
          {Hooks.formatCurrency(data.aggregation.price.base_rent)}
          <Text style={{ justifyContent: 'center', fontSize: 12 }}>{' / sqm / bulan'}</Text>
        </Text>

        {/* Details Tower */}
        {this._renderTowerDetails(data)}

        {/* Tower Description */}
        <Text style={[
          {
            marginHorizontal: 20,
            marginTop: 30,
            marginBottom: 10,
            fontSize: 16,
            fontWeight: 'bold'
          }
        ]}>
          {'Tentang ' + data.name}
        </Text>
        <HTML
          containerStyle={{
            marginHorizontal: 20,
          }}
          baseFontStyle={{
            fontSize: 12,
            color: Styles.Colors.black,
            textAlign: 'justify'
          }}
          imagesMaxWidth={width - (60)}
          html={data.description.id}
        />

        {/* Tower Facility */}
        {
          data.facilities.main_facilities != null &&
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
              {'Fasilitas Tower'}
            </Text>
            {this._renderTowerFacility(data.facilities.main_facilities)}
          </View>
        }

        {/* Informasi */}
        <Text style={[
          {
            marginHorizontal: 20,
            marginTop: 30,
            marginBottom: 10,
            fontSize: 16,
            fontWeight: 'bold'
          }
        ]}>
          {'Informasi'}
        </Text>

        <View style={[
          Styles.Helpers.row,
          Styles.Helpers.mainSpaceBetween,
          // Styles.Helpers.crossCenter,
          {
            flexWrap: 'wrap',
            padding: 10,
            borderRadius: 10,
          }
        ]}>
          {this._renderCardOfficeHours(data.office_hours)}
          {this._renderCardParkingTerms(data.parking_terms)}
          {this._renderCardLifts(data.lift)}
          {this._renderCardToilet(data.toilet)}
        </View>

        {/* Interior */}
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

        {/* Interior */}
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
    );
  }

  _renderBanner(
    images,
    style = 'portrait',
    type = Http.TOWER_IMAGE_URL
  ) {
    let portrait = (4 / 3);
    let landscape = (3 / 4);

    let bannerComp = [];

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

  _renderTowerDetails(data) {
    let details = [
      { id: 0, label: 'Dibangun', value: data.year_completion },
      { id: 1, label: 'Jumlah Lantai', value: data.floor_count },
      { id: 2, label: 'Luas Bangunan', value: data.semi_gross_area + ' sqm' },
      { id: 3, label: 'Luas Lantai', value: data.average_floor_plate + ' sqm' },
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

          {
            index != (details.length - 1) &&
            <View
              style={{
                borderRightWidth: 1,
                height: 20,
                marginLeft: 10,
                borderColor: 'lightgray'
              }}
            />
          }
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

  _renderTowerFacility(facility) {
    let facilComp = [];

    if (facility == null) {
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
        ]} />
      );
    }

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
            fontSize: 11
          }}>
            {item}
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

  _renderCardOfficeHours(data) {
    return (
      <View style={[
        Styles.Helpers.row,
        {
          width: (width / 2) - 15,
          backgroundColor: Styles.Colors.whiteSmoke,
          padding: 10,
          marginVertical: 5,
          borderRadius: 10,
        }
      ]}>
        <Icon
          name={'briefcase-clock-outline'}
          type={'MaterialCommunityIcons'}
          style={{
            color: Styles.Colors.primary,
            fontSize: 20,
            marginRight: 10,
          }}
        />

        <View style={{
          flex: 1
        }}>
          <Text style={{
            fontSize: 11,
            fontWeight: 'bold'
          }}>{'Jam Kantor'}</Text>

          <View style={{
            marginBottom: 5
          }}>
            <Text style={{
              fontSize: 10,
            }}>
              {'Senin - Jumat : '}
            </Text>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 10,
            }}>
              {(data.weekday.is_open ? (data.weekday.opening_hour + ' - ' + data.weekday.closing_hour) : 'Libur')}
            </Text>
          </View>

          <View style={{
            marginBottom: 5
          }}>
            <Text style={{
              fontSize: 10,
            }}>
              {'Sabtu : '}
            </Text>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 10,
            }}>
              {(data.saturday.is_open ? (data.saturday.opening_hour + ' - ' + data.saturday.closing_hour) : 'Libur')}
            </Text>
          </View>

          <View style={{
            marginBottom: 5
          }}>
            <Text style={{
              fontSize: 10,
            }}>
              {'Minggu : '}
            </Text>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 10,
            }}>
              {(data.sunday.is_open ? (data.sunday.opening_hour + ' - ' + data.sunday.closing_hour) : 'Libur')}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  _renderCardParkingTerms(data) {
    let component = [];

    for (let [index, item] of data.entries()) {
      component.push(
        <View
          key={"liftComponent_" + index + item.type}
          style={{
            marginBottom: 5,
          }}
        >
          <Text style={{
            fontSize: 10,
          }}>
            {item.type + ' ' + item.term}
          </Text>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 10,
          }}>
            {Hooks.formatCurrency(item.price)}
          </Text>
        </View>
      );
    }
    return (
      <View style={[
        Styles.Helpers.row,
        {
          width: (width / 2) - 15,
          backgroundColor: Styles.Colors.whiteSmoke,
          padding: 10,
          marginVertical: 5,
          borderRadius: 10,
        }
      ]}>
        <Icon
          name={'car-brake-parking'}
          type={'MaterialCommunityIcons'}
          style={{
            color: Styles.Colors.primary,
            fontSize: 20,
            marginRight: 10,
          }}
        />

        <View style={[
          Styles.Helpers.fill
        ]}>
          <Text style={{
            fontSize: 11,
            fontWeight: 'bold'
          }}>{'Parkir Langganan'}</Text>
          {component}
        </View>
      </View>
    );
  }

  _renderCardLifts(data) {
    let component = [];

    for (let [index, item] of data.entries()) {
      component.push(
        <View
          key={"liftComponent_" + index + item.type}
          style={{
            marginBottom: 5,
          }}
        >
          <Text style={{
            fontSize: 10,
          }}>
            {item.name}
          </Text>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 10,
          }}>
            {item.count}
          </Text>
        </View>
      );
    }
    return (
      <View style={[
        Styles.Helpers.row,
        {
          width: (width / 2) - 15,
          backgroundColor: Styles.Colors.whiteSmoke,
          padding: 10,
          marginVertical: 5,
          borderRadius: 10,
        }
      ]}>
        <Icon
          name={'elevator'}
          type={'Foundation'}
          style={{
            color: Styles.Colors.primary,
            fontSize: 20,
            marginRight: 10,
          }}
        />

        <View style={[
          Styles.Helpers.fill
        ]}>
          <Text style={{
            fontSize: 11,
            fontWeight: 'bold'
          }}>{'Lifts'}</Text>
          {component}
        </View>
      </View>
    );
  }

  _renderCardToilet(data) {
    let component = [];

    for (let item in data) {
      component.push(
        <View
          key={"toiletComponent_" + item}
          style={{
            marginBottom: 5,
          }}
        >
          <Text style={{
            fontSize: 10,
            textTransform: 'capitalize'
          }}>
            {item.toString().replace("_", " ")}
          </Text>
          <Text style={{
            fontWeight: 'bold',
            fontSize: 10,
          }}>
            {data.hasOwnProperty(item) ? data[item] : ''}
          </Text>
        </View>
      );
    }
    return (
      <View style={[
        Styles.Helpers.row,
        {
          width: (width / 2) - 15,
          backgroundColor: Styles.Colors.whiteSmoke,
          padding: 10,
          marginVertical: 5,
          borderRadius: 10,
        }
      ]}>
        <Icon
          name={'toilet'}
          type={'MaterialCommunityIcons'}
          style={{
            color: Styles.Colors.primary,
            fontSize: 20,
            marginRight: 10,
          }}
        />

        <View style={[
          Styles.Helpers.fill
        ]}>
          <Text style={{
            fontSize: 11,
            fontWeight: 'bold'
          }}>{'Toilet'}</Text>
          {component}
        </View>
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
          {this.mainRenderTower()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  refresh_app: state.refresh_app,
  unitData: state.unitData,
});

const mapDispatchToProps = dispatch => bindActionCreators(AppActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TowerDetails);
