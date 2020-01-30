import React from 'react';
import {View} from 'react-native';

import 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';

import HomePage from './screens/home';
import ExercisePage from './screens/exercise';
import ProgressPage from './screens/progress';

import SSColors from './styles/colors.js';

const TabNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomePage,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon style={[{color: tintColor}]} size={25} name={'ios-home'} />
          </View>
        ),
      },
    },
    Exercise: {
      screen: ExercisePage,
      navigationOptions: {
        tabBarLabel: 'Exercise',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon style={[{color: tintColor}]} size={25} name={'ios-walk'} />
          </View>
        ),
        activeColor: SSColors.black,
        inactiveColor: SSColors.lighter,
        barStyle: {backgroundColor: SSColors.primary},
      },
    },
    Progress: {
      screen: ProgressPage,
      navigationOptions: {
        tabBarLabel: 'Progress',
        tabBarIcon: ({tintColor}) => (
          <View>
            <Icon
              style={[{color: tintColor}]}
              size={25}
              name={'ios-trending-up'}
            />
          </View>
        ),
        activeColor: SSColors.black,
        inactiveColor: SSColors.lighter,
        barStyle: {backgroundColor: SSColors.primary},
      },
    },
  },
  {
    initialRouteName: 'Home',
    activeColor: SSColors.black,
    inactiveColor: SSColors.lighter,
    barStyle: {backgroundColor: SSColors.primary},
  },
);

export default createAppContainer(TabNavigator);
