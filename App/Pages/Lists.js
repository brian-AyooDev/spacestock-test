import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
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
import DropDownPicker from 'App/Components/DropDownPicker';
import SwitchButton from 'App/Components/SwitchButton';

const { width, height } = Dimensions.get('window');
const TAG = "Lists ";

const MAX_PRICE = 1000000000000;

class Lists extends Component {
  static navigationOptions = () => ({ headerShown: false });

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      refreshing: false,
      listData: [],
      sortBy: this.props.searchConfig.searchUnit == Hooks.APARTMENT ?
        'recommended' :
        'latest',

      minPrice: '',
      maxPrice: '',
      filterModalVisible: false,
    };
  }

  componentDidMount() {
    this.loadDummyData();
  }

  _onRefresh() {
    this.setState({
      listData: [],
      isLoading: true,
      refreshing: true,
      minPrice: 0,
      maxPrice: MAX_PRICE,
      sortBy: this.props.searchConfig.searchUnit == Hooks.APARTMENT ? 'recommended' : 'latest',
    });

    this.loadDummyData();

    setTimeout(() => {
      this.setState({
        isLoading: false,
        refreshing: false
      });
    }, 1500);
  }

  reloadDummyData() {
    this.setState({ isLoading: true });
    this.loadDummyData();
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1500);
  }

  loadDummyData() {
    let path = '';
    let cloneData = [];
    let dummyData = [];

    if (this.props.searchConfig.searchUnit == Hooks.APARTMENT) {
      path = 'App/Assets/DummyData/' +
        this.props.searchConfig.searchUnit + '/' +
        this.props.searchConfig.searchType + '/' +
        this.props.searchConfig.searchLocation + '/data.json';
    }
    else {
      path = 'App/Assets/DummyData/' +
        this.props.searchConfig.searchUnit + '/area/' +
        this.props.searchConfig.searchLocation + '/data.json';
    }

    Hooks.consoleLog(TAG + "path: ", path);

    // MAKE SURE TO clone JSON in immutable to keep source file
    cloneData = DummyData[path];
    dummyData = { ...cloneData };
    dummyData['data'] = this.reformatData(dummyData['data']);

    this.setState({
      dummyAPIPath: path,
      listData: dummyData,
    }, () => {
      Hooks.consoleLog(TAG + "dummyData: ", dummyData);
      Hooks.consoleLog(TAG + "this.state.listData: ", this.state.listData);
    });
  }

  loadSortOptions() {
    let optionsSort = [
      { id: 1, label: 'A - Z', value: 'asc_name' },
      { id: 2, label: 'Z - A', value: 'desc_name' },
      { id: 3, label: 'Harga Terendah', value: 'asc_price' },
      { id: 4, label: 'Harga Tertinggi', value: 'desc_price' },
    ];

    this.props.searchConfig.searchUnit == Hooks.APARTMENT ?
      optionsSort.unshift(
        { id: 5, label: 'Rekomendasi', value: 'recommended' },
      )
      :
      optionsSort.unshift(
        { id: 5, label: 'Terbaru', value: 'latest' },
      );

    return optionsSort;
  }

  reformatData(payload) {
    let newData = payload;
    for (let item of newData) {
      this.props.searchConfig.searchUnit == Hooks.APARTMENT ?
        item['lowest_price'] = item.aggregation.unit[0].value.toString() :
        item['lowest_price'] = item.aggregation.price.base_rent.toString()
    }
    return newData;
  }

  resetFilterPrice(type) {
    type == 'min' ?
      this.setState({ minPrice: 0 }) :
      this.setState({ maxPrice: MAX_PRICE })
  }

  doFilter() {
    this.setState({
      isLoading: true,
      filterModalVisible: false,
    });
    this.filterByPrice(this.state.minPrice, this.state.maxPrice);

    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 1000);
  }

  filterByPrice(min, max) {
    Hooks.consoleLog(TAG + "min: ", min);
    Hooks.consoleLog(TAG + "max: ", max);

    if (min == '') {
      this.resetFilterPrice('min');
    }

    if (max == '') {
      this.resetFilterPrice('max');
    }

    if (parseInt(this.state.minPrice) > parseInt(this.state.maxPrice)) {
      return Hooks.alertHandler('Mohon input harga yang sesuai.');
    }

    // Immutable clone JSON
    let original = [...DummyData[this.state.dummyAPIPath]['data']];

    original = this.reformatData(original);
    let newData = []; // new data result of filter

    let propPrice;

    for (let i = 0; i < original.length; i++) {
      if ((parseInt(original[i].lowest_price) >= min) && (parseInt(original[i].lowest_price) <= max)) {
        newData.push(original[i]);
      }
    }

    Hooks.consoleLog(TAG + "newData: ", newData);

    this.setState(prevState => {
      let newState = prevState.listData;
      newState['data'] = newData;
      newState['paging']['total_data'] = newData.length;

      return { listData: newState };
    });
  }

  doSort(type) {
    this.setState({ isLoading: true });

    let newData; // new data result of sort

    switch (type) {
      case 'asc_price':
        newData = Hooks.JSONsortByProperty(
          this.state.listData['data'],
          'lowest_price'
        );
        setTimeout(() => {
          this.setState({ isLoading: false });
        }, 500);
        break;

      case 'desc_price':
        newData = Hooks.JSONsortByProperty(
          this.state.listData['data'],
          'lowest_price',
          -1
        );
        setTimeout(() => {
          this.setState({ isLoading: false });
        }, 500);
        break;

      case 'asc_name':
        newData = Hooks.JSONsortByProperty(
          this.state.listData['data'],
          'name'
        );
        setTimeout(() => {
          this.setState({ isLoading: false });
        }, 500);
        break;

      case 'desc_name':
        newData = Hooks.JSONsortByProperty(
          this.state.listData['data'],
          'name',
          -1
        );
        setTimeout(() => {
          this.setState({ isLoading: false });
        }, 500);
        break;

      default:
        newData = Hooks.JSONsortByProperty(
          this.state.listData['data'],
          'id'
        );
        setTimeout(() => {
          this.setState({ isLoading: false });
        }, 500);
        break;
    }

    this.setState(prevState => {
      let newState = prevState.listData;
      newState['data'] = newData;

      return { listData: newState };
    }, () => {
      Hooks.consoleLog(TAG + "result sortBy: " + type, this.state.listData);
    });
  }

  discover(item, type) {
    this.props.setUnitData({
      unitType: type,
      data: item
    });
    this.props.navigation.navigate('Details');
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

  renderSortFilter() {
    let optionsSort = this.loadSortOptions();

    return (
      <View style={[{ padding: 10 }]}>
        <View style={[
          Styles.Helpers.row,
          Styles.Helpers.crossCenter,
          Styles.Helpers.mainSpaceBetween,
        ]}>
          {/* Button Filter */}
        <TouchableOpacity
          style={[
            Styles.Helpers.center,
            {
              zIndex: 0,
              flex: 0.2,
              backgroundColor: Styles.Colors.primary,
              height: 30,
              paddingHorizontal: 30,
              marginVertical: 5,
              marginHorizontal: 5,
              borderRadius: 5,
              marginRight: 50,
            }
          ]}
          onPress={() => this.setState({ filterModalVisible: true })}
        >
          <Text style={{
            color: Styles.Colors.white,
            fontSize: 12,
          }}>
            {'Filter'}
          </Text>
          <Icon
            name={'check-circle-outline'}
            type={'MaterialCommunityIcons'}
            style={{
              position: 'absolute',
              bottom: -3,
              right: -3,
              color: Styles.Colors.white,
              fontSize: Styles.Metrics.xsImg
            }}
          />
        </TouchableOpacity>


          <View style={[
            Styles.Helpers.row,
            Styles.Helpers.crossCenter,
            Styles.Helpers.mainSpaceBetween,
            { flex: 0.8 }
          ]}>
            <Text style={[{
              fontSize: 12
            }]}>
              {'Urutkan : '}
            </Text>
            <View style={[
              {
                marginRight: 5,
                flex: 1
              }
            ]}>
              <DropDownPicker
                items={optionsSort}
                defaultValue={this.state.sortBy}
                containerStyle={{ height: 40 }}
                style={{ backgroundColor: Styles.Colors.white }}
                itemStyle={{ justifyContent: 'flex-start' }}
                dropDownStyle={{ backgroundColor: Styles.Colors.white }}
                onChangeItem={item => {
                  this.setState({ sortBy: item.value }, () => {
                    this.doSort(item.value);
                  });
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderDataList() {
    let data = this.state.listData;
    let component = [];

    if (data.hasOwnProperty('data')) {
      component.push(
        <FlatList
          key={'renderDataList'}
          contentContainerStyle={[Styles.Helpers.mainCenter]}
          data={data['data']}
          keyExtractor={(item, index) => "renderTower_" + item.id + "_" + index}
          refreshing={this.state.refreshing}
          onRefresh={() => this._onRefresh()}
          ListEmptyComponent={() => {
            return (
              <View>
                {
                  !this.state.isLoading &&
                  <View style={[
                    Styles.Helpers.center,
                    Styles.Helpers.fill,
                  ]}>
                    <Text style={{
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: 14,
                      paddingVertical: 20
                    }}>
                      {lang('label.no_data')}
                    </Text>
                  </View>
                }
              </View>
            );
          }}
          renderItem={
            ({ item, index }) => {
              return (
                <TouchableOpacity>
                  {
                    this.props.searchConfig.searchUnit == Hooks.OFFICE ?
                      this._renderTowerCard(item, index) :
                      this._renderComplexCard(item, index, this.props.searchConfig.searchType)
                  }
                </TouchableOpacity>
              );
            }
          }
        />
      );
    }

    return (
      <View style={[Styles.Helpers.fill]}>
        {component}
      </View>
    );
  }

  _renderTowerCard(item, index) {
    let marginHorizontal = 10,
      marginVertical = 10,
      portrait = (4 / 3),
      landscape = (3 / 4)
      ;

    return (
      <View style={[
        Styles.Helpers.row,
      ]}>
        <TouchableOpacity
          onPress={() => this.discover(item, Hooks.OFFICE)}
          style={[
            Styles.MainStyles.boxShadow2,
            Styles.MainStyles.crossSpaceBetween,
            {
              backgroundColor: Styles.Colors.white,
              borderRadius: 10,
              margin: marginHorizontal
            }
          ]}
        >
          <ImageBackground
            source={{
              uri: 'https://res.cloudinary.com/dpqdlkgsz/image/private/t_anteoculatia_reducto/' +
                item.images.images_exterior[0].url
            }}
            imageStyle={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            style={[
              Styles.Helpers.crossCenter,
              Styles.Helpers.mainEnd,
              {
                borderRadius: 10,
                resizeMode: "cover",
                width: width - (2 * marginHorizontal),
                height: ((width - (2 * marginHorizontal)) * portrait),
              }
            ]}
          />
          <View style={[
            {
              margin: 10
            }
          ]}>
            <Text style={{
              fontWeight: 'bold',
              marginBottom: 10,
            }}>
              {item.name}
            </Text>
            <Text style={{
              color: Styles.Colors.grayDark,
              fontSize: 10,
              marginBottom: 5,
            }}>
              {'Mulai dari'}
            </Text>
            <Text style={{
              fontWeight: 'bold',
              justifyContent: 'center',
              fontSize: 14
            }}>
              {Hooks.formatCurrency(item.aggregation.price.base_rent)}
              <Text style={{ justifyContent: 'center', fontSize: 12, fontWeight: 'bold' }}>{' / sqm / bulan'}</Text>
            </Text>

            <View style={[
              Styles.Helpers.row,
              {
                marginTop: 5,
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
                fontSize: 10,
                marginBottom: 5,
              }}>
                {item.aggregation.address.district + ', ' + item.aggregation.address.city}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _renderComplexCard(item, index, type = Hooks.BUY_TYPE) {
    let marginHorizontal = 10,
      marginVertical = 10,
      portrait = (4 / 3),
      landscape = (3 / 4)
      ;

    return (
      <View style={[
        Styles.Helpers.row,
      ]}>
        <TouchableOpacity
          onPress={() => this.discover(item, Hooks.APARTMENT)}
          style={[
            Styles.MainStyles.boxShadow2,
            Styles.MainStyles.crossSpaceBetween,
            {
              backgroundColor: Styles.Colors.white,
              borderRadius: 10,
              margin: marginHorizontal
            }
          ]}
        >
          <ImageBackground
            source={{
              uri: 'https://res.cloudinary.com/dpqdlkgsz/image/private/t_anteoculatia_reducto/' +
                item.images.images_exterior[0].url
            }}
            imageStyle={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
            style={[
              Styles.Helpers.crossCenter,
              Styles.Helpers.mainEnd,
              {
                borderRadius: 10,
                resizeMode: "cover",
                width: width - (2 * marginHorizontal),
                height: (width - (2 * marginHorizontal)) * landscape,
              }
            ]}
          />
          <View style={[
            {
              margin: 10
            }
          ]}>
            <Text style={{
              fontWeight: 'bold',
              marginBottom: 10,
            }}>
              {item.name}
            </Text>
            <Text style={{
              color: Styles.Colors.grayDark,
              fontSize: 10,
              marginBottom: 5,
            }}>
              {'Mulai'}
            </Text>

            {
              type == Hooks.BUY_TYPE ?
                <Text style={{
                  fontWeight: 'bold',
                  justifyContent: 'center',
                  fontSize: 14
                }}>
                  {Hooks.formatCurrency(
                    item.aggregation.unit[0].value,
                    'IDR',
                    0,
                    true
                  )}
                </Text>
                :
                <Text style={{
                  fontWeight: 'bold',
                  justifyContent: 'center',
                  fontSize: 14
                }}>
                  {Hooks.formatCurrency(item.aggregation.unit[0].value)}
                  <Text style={{ justifyContent: 'center', fontSize: 12, fontWeight: 'bold' }}>{' / bulan'}</Text>
                </Text>
            }

            <View style={[
              Styles.Helpers.row,
              {
                marginTop: 5,
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
                fontSize: 10,
                marginBottom: 5,
              }}>
                {Hooks.sentenceCase(item.address_city)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  renderSearchInfo() {
    let component = [];

    if (this.state.listData.hasOwnProperty('data')) {
      component.push(
        <View
          key={'renderSearchInfo'}
          style={[
            Styles.Helpers.fill,
            Styles.Helpers.row,
            Styles.Helpers.crossCenter,
            {
              marginBottom: 20,
              marginHorizontal: 10,
            }
          ]}
        >
          {
            !this.state.isLoading ?
              <View style={[
                Styles.Helpers.fill,
              ]}>
                <Text style={{
                  textAlign: 'left',
                  fontSize: 12,
                  paddingTop: 10,
                  paddingHorizontal: 10
                }}>
                  {'Hasil pencarian ' + lang('label.' + this.props.searchConfig.searchUnit)}
                </Text>
                <Text style={{
                  textAlign: 'left',
                  fontSize: 12,
                  paddingTop: 10,
                  paddingHorizontal: 10
                }}>
                  <Text style={{
                    textAlign: 'left',
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: Styles.Colors.primary,
                    paddingTop: 10,
                    paddingHorizontal: 10
                  }}>
                    {this.state.listData.paging['total_data']}{' '}
                  </Text>
                  {this.props.searchConfig.searchUnit + ' ditemukan'}
                </Text>
              </View>
              :
              <View style={[Styles.Helpers.fill]} />
          }

          {
            this.props.searchConfig.searchUnit == Hooks.APARTMENT &&
            <SwitchButton
              onValueChange={(val) => {
                this.props.setSearchConfig({ searchType: val });
                Hooks.consoleLog(TAG + "val: ", this.props.searchConfig.searchType);
                this.reloadDummyData();
              }}
              activeSwitch={this.props.searchConfig.searchType}
              value1={Hooks.RENT_TYPE}
              value2={Hooks.BUY_TYPE}
              text1={'Sewa'}
              text2={'Beli'}
              switchWidth={100}
              switchHeight={40}
              switchdirection={'ltr'}
              switchBorderRadius={10}
              switchSpeedChange={250}
              switchBorderColor={Styles.Colors.primary}
              switchBackgroundColor={Styles.Colors.white}
              btnBorderColor={Styles.Colors.primary}
              btnBackgroundColor={Styles.Colors.primary}
              fontColor={'black'}
              activeFontColor={Styles.Colors.white}
            />
          }
        </View>
      );
    }

    return (
      <View style={[
        Styles.Helpers.row,
        Styles.Helpers.center,
        Styles.Helpers.mainSpaceBetween,
        {
          zIndex: -100,
          marginTop: 10,
          backgroundColor: Styles.Colors.white
        }
      ]}>
        {component}
      </View>
    );
  }

  renderFilterModal() {
    let component =
      <Modal
        transparent={true}
        animationType={'slide'}
        visible={this.state.filterModalVisible}
        onRequestClose={() => this.setState({
          filterModalVisible: false,
        })}
      >
        <AppFrame
          headerLeft={
            <View />
          }
          headerRight={
            <Button
              transparent
              onPress={() => this.setState({
                filterModalVisible: false,
              })}
            >
              <Icon
                name={'close'}
                type={'MaterialCommunityIcons'}
                style={{
                  color: Styles.Colors.gray,
                  fontSize: Styles.Metrics.xsImg
                }}
              />
            </Button>
          }
          headerTitle={'Filter'}
          renderContent={
            <ScrollView style={[
              {
                paddingHorizontal: 10,
              }
            ]}>
              <View style={[
                Styles.Helpers.row
              ]}>
                <View style={[
                  Styles.Helpers.fill,
                  { marginLeft: 5 }
                ]}>
                  <Text style={[{
                    fontSize: 12,
                    paddingVertical: 5,
                  }]}>
                    {'Harga Min'}
                  </Text>
                  <TextInput
                    onChangeText={(minPrice) => this.setState({ minPrice })}
                    autoCapitalize={'none'}
                    value={this.state.minPrice}
                    style={[
                      {
                        height: 40,
                        borderWidth: 1,
                        borderRadius: 5,
                        paddingHorizontal: 5,
                        marginRight: 5,
                        borderColor: Styles.Colors.grayLight,
                        fontSize: 12,
                      }
                    ]}
                    placeholderTextColor={Styles.Colors.grayLight}
                    returnKeyType={'go'}
                    placeholder={'Tanpa min harga'}
                    keyboardType={'number-pad'}
                  />
                </View>

                <View style={[
                  Styles.Helpers.fill,
                  { marginLeft: 5 }
                ]}>
                  <Text style={[{
                    fontSize: 12,
                    paddingVertical: 5,
                  }]}>
                    {'Harga Max'}
                  </Text>
                  <TextInput
                    onChangeText={(maxPrice) => this.setState({ maxPrice })}
                    autoCapitalize={'none'}
                    value={this.state.maxPrice}
                    style={[
                      {
                        height: 40,
                        borderWidth: 1,
                        borderRadius: 5,
                        paddingHorizontal: 5,
                        borderColor: Styles.Colors.grayLight,
                        fontSize: 12,
                      }
                    ]}
                    placeholderTextColor={Styles.Colors.grayLight}
                    returnKeyType={'go'}
                    placeholder={'Tanpa max harga'}
                    keyboardType={'number-pad'}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  Styles.Helpers.center,
                  {
                    zIndex: -10,
                    // backgroundColor: Styles.Colors.primary,
                    height: 40,
                    paddingHorizontal: 10,
                    marginTop: 20,
                    borderRadius: 5
                  }
                ]}
                onPress={() => {
                  this.resetFilterPrice('min');
                  this.resetFilterPrice('max');
                }}
              >
                <Text style={{
                  color: Styles.Colors.primary
                }}>
                  {'Reset filter'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  Styles.Helpers.center,
                  {
                    zIndex: -10,
                    backgroundColor: Styles.Colors.primary,
                    height: 40,
                    paddingHorizontal: 10,
                    marginTop: 20,
                    borderRadius: 5
                  }
                ]}
                onPress={() => this.doFilter()}
              >
                <Text style={{
                  color: Styles.Colors.white
                }}>
                  {'Cari'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          }
        />
      </Modal>
      ;

    return component;
  }

  render_old() {
    return (
      <SafeAreaView
        style={[
          Styles.Helpers.fill,
          {
            backgroundColor: Styles.Colors.white,
          }
        ]}
        forceInset={{ top: 'never' }}
      >
        <Loader loading={this.state.isLoading} />
        {this.renderHeader()}

        <View style={{ zIndex: 100 }}>
          {this.renderSortFilter()}
          {this.renderSearchInfo()}
        </View>
        {
          !this.state.isLoading &&
          this.renderDataList()
        }
        {this.renderFilterModal()}

        {/* <View style={[
          Styles.Helpers.fill,
          { zIndex: -100 }
        ]}>
        </View> */}
      </SafeAreaView>
    );
  }

  render() {
    return (
      <SafeAreaView
        style={[
          Styles.Helpers.fill,
          {
            backgroundColor: Styles.Colors.white,
          }
        ]}
        forceInset={{ top: 'never' }}
      >
        <Loader loading={this.state.isLoading} />
        {this.renderHeader()}
        {this.renderSortFilter()}
        {this.renderSearchInfo()}
        {
          !this.state.isLoading &&
          this.renderDataList()
        }
        {this.renderFilterModal()}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  refresh_app: state.refresh_app,
  searchConfig: state.searchConfig,
});

const mapDispatchToProps = dispatch => bindActionCreators(AppActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Lists);
