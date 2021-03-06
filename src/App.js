import React from 'react';

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {Icon} from 'native-base';

import HomePage from './screens/home/main';
import ExercisePage from './screens/exercise/main';
import ProgressPage from './screens/progress';

import SSColors from './styles/colors.js';

const Tab = createMaterialBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={SSColors.lighter}
      inactiveColor={SSColors.black}
      labelStyle={{fontSize: 12}}
      style={{backgroundColor: SSColors.background}}
      barStyle={{backgroundColor: SSColors.background, padding: 5}}>
      <Tab.Screen
        name="Feed"
        component={HomePage}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon
              style={[{color: color}]}
              size={size}
              type="MaterialCommunityIcons"
              name="home"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Exercise"
        component={ExercisePage}
        options={{
          tabBarLabel: 'Exercise',
          tabBarIcon: ({color, size}) => (
            <Icon
              style={[{color: color}]}
              size={size}
              type="MaterialCommunityIcons"
              name="run-fast"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressPage}
        options={{
          tabBarLabel: 'Progress',
          tabBarIcon: ({color, size}) => (
            <Icon
              style={[{color: color}]}
              type="FontAwesome"
              size={size}
              name="sliders"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProgressPage}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Icon
              style={[{color: color}]}
              type="MaterialIcons"
              size={size}
              name="person"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}

export default App;
