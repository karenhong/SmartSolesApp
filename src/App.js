import React from 'react';
import {View} from 'react-native';

import 'react-native-gesture-handler';
import {createAppContainer} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {Icon} from 'native-base';

import HomePage from './screens/home/home';
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
          <Icon
            style={[{color: tintColor}]}
            size={25}
            type="MaterialCommunityIcons"
            name="home"
          />
        ),
      },
    },
    Exercise: {
      screen: ExercisePage,
      navigationOptions: {
        tabBarLabel: 'Exercise',
        tabBarIcon: ({tintColor}) => (
          <Icon
            style={[{color: tintColor}]}
            size={25}
            type="MaterialCommunityIcons"
            name="run-fast"
          />
        ),
        activeColor: SSColors.black,
        inactiveColor: SSColors.lighter,
        barStyle: {backgroundColor: SSColors.primary},
      },
    },
    Progress: {
      screen: ExercisePage,
      navigationOptions: {
        tabBarLabel: 'Progress',
        tabBarIcon: ({tintColor}) => (
          <Icon
            style={[{color: tintColor}]}
            type="FontAwesome5"
            size={25}
            name="sliders-h"
          />
        ),
        activeColor: SSColors.black,
        inactiveColor: SSColors.lighter,
        barStyle: {backgroundColor: SSColors.primary},
      },
    },
    Profile: {
      screen: ProgressPage,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({tintColor}) => (
          <Icon
            style={[{color: tintColor}]}
            type="MaterialIcons"
            size={25}
            name="person"
          />
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
