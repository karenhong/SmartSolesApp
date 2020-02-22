import React from 'react';
import {View, Text, Platform, TouchableOpacity} from 'react-native';

import HomeHeader from './header';
import DeviceManager from '../../bluetooth/DeviceManager';
import SSStyles from '../../styles/common-styles';

class HomePage extends React.Component {
  constructor() {
    super();
    this.manager = new DeviceManager();
    this.state = {
      info: '',
      connected: false,
      values: '',
      balance: '...',
    };
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      this.manager.bleManager.onStateChange(state => {
        if (state === 'PoweredOn') {
          this.manager.scanAndConnect();
        }
      });
    } else {
      this.manager.scanAndConnect();
    }
  }

  assessBalance() {
    this.setState({balance: 'being assessed'});
    this.manager.receiveNotifications().then(score => {
      this.setState({balance: score});
    });
  }

  render() {
    return (
      <View
        // TODO: Move this to styles file
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch',
          alignContent: 'space-between',
        }}>
        <HomeHeader />

        <View style={{flex: 1, alignItems: 'center'}}>
          <TouchableOpacity
            disabled={
              this.state.balance === 'being assessed' // TODO: disable when not connected
            }
            onPress={() => {
              this.assessBalance();
            }}
            style={
              this.state.balance === 'being assessed'
                ? SSStyles.disabledButton
                : SSStyles.roundButton
            }>
            <Text style={SSStyles.buttonText}>Assess balance</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <Text style={SSStyles.sectionDescription}>
            Your balance is {this.state.balance}.
          </Text>
        </View>
      </View>
    );
  }
}

export default HomePage;
