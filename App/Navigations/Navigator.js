import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';

// ***** Import Pages ***** //
import Splash from 'App/Pages/Splash';
import Home from 'App/Pages/Home';
import Lists from 'App/Pages/Lists';
import Details from 'App/Pages/Details';
import Counter from 'App/Pages/Counter';
// ***** /Import Pages ***** //

const MainStack = createStackNavigator({
  Home: Home,
  Lists: Lists,
  Details: Details,
}, {
  headerMode: 'none',
  defaultNavigationOptions: {
    headerShown: false,
    ...TransitionPresets.SlideFromRightIOS
  }
});

const AppNavigator = createSwitchNavigator({
  Splash: Splash,
  MainStack: MainStack
});

export default createAppContainer(AppNavigator);
