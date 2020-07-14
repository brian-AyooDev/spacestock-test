import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator, TransitionPresets } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';

// ***** Import Pages ***** //
// ** Front Pages
import Splash from 'App/Pages/Splash';
import Home from 'App/Pages/Home';
import Counter from 'App/Pages/Counter';
// ***** /Import Pages ***** //

const MainStack = createStackNavigator({
  Home: Home,
  Counter: Counter
}, {
  headerMode: 'none',
  defaultNavigationOptions: {
    headerShown: false,
    ...TransitionPresets.FadeFromBottomAndroid
  }
});

const AppNavigator = createSwitchNavigator({
  Splash: Splash,
  MainStack: MainStack
});

export default createAppContainer(AppNavigator);
