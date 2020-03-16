import React from 'react';

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {View} from 'react-native';
import {Container, Content, Icon, Root, Toast} from 'native-base';

import HomePage from './screens/home/main';
import ExercisePage from './screens/exercise/main';

import SSColors from './styles/colors.js';
import SSStyles from './styles/common-styles.js';
import DeviceManager from './bluetooth/DeviceManager';
import HomeHeader from './header';
import {EventRegister} from 'react-native-event-listeners';
import {Status} from './bluetooth/Status';

const Tab = createMaterialBottomTabNavigator();

const deviceManager = new DeviceManager();

function HomeScreen() {
  return <HomePage deviceManager={deviceManager} />;
}

function ExerciseScreen() {
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

class MainApp extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      connected: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.errorListener = EventRegister.addEventListener(
      'error',
      this.errorToast,
    );
    this.statusListener = EventRegister.addEventListener(
      'changeStatus',
      this.changeStatusToast,
    );

    deviceManager.connectSmartSoles();

    this.changeStatusToast(Status.SCANNING);
  }

  componentWillUnmount(): void {
    this._isMounted = false;

    Toast.toastInstance = null;
    EventRegister.removeEventListener(this.errorListener);
    EventRegister.removeEventListener(this.statusListener);
  }

  errorToast = errMsg => {
    console.log(errMsg);
    Toast.show({
      text: errMsg,
      duration: 3000,
      position: 'center',
      type: 'danger',
    });
  };

  changeStatusToast = data => {
    let text = '';
    let type = 'default';
    let duration = 3000;
    switch (data.status) {
      case Status.CONNECTED:
        type = 'success';
        text = 'Connected to Smart Soles';
        this.updateState({enabled: true});
        this.updateState({connected: true});
        break;
      case Status.CONNECTING:
        type = 'success';
        text = 'Connected to ' + data.extra;
        duration = 1000;
        break;
      case Status.SCANNING:
        text = 'Scanning for Smart Soles';
        break;
      case Status.NOT_CONNECTED:
        type = 'danger';
        text = 'Lost connection to Smart Soles';
        this.updateState({enabled: false});
        this.updateState({connected: false});
        break;
    }
    Toast.show({
      text: text,
      duration: duration,
      position: 'center',
      type: type,
    });
  };

  render() {
    return (
      <Root>
        <Container>
          <Content
            contentContainerStyle={{
              flex: 1,
            }}>
            <HomeHeader connected={this.state.connected} />
            <View style={SSStyles.shadow} />
            <MyTabs />
          </Content>
        </Container>
      </Root>
    );
  }
}

function App() {
  return (
    <NavigationContainer>
      <MainApp />
    </NavigationContainer>
  );
}

export default App;
