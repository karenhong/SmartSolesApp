import React from 'react';

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {Icon} from 'native-base';

import HomePage from './screens/home/main';
import ExercisePage from './screens/exercise/main';

import SSColors from './styles/colors.js';
import DeviceManager from './bluetooth/DeviceManager';

const Tab = createMaterialBottomTabNavigator();

const deviceManager = new DeviceManager();

function HomeScreen({navigation}) {
  return <HomePage deviceManager={deviceManager} />;
}

function ExerciseScreen({navigation}) {
  return <ExercisePage deviceManager={deviceManager} />;
}

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
        component={HomeScreen}
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
        component={ExerciseScreen}
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
