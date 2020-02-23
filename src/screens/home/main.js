import React from 'react';
import {View, Text, Platform, TouchableOpacity} from 'react-native';
import {Container, Content, H3, Toast} from 'native-base';
import {Row, Grid} from 'react-native-easy-grid';

import HomeHeader from './header';
import DeviceManager from '../../bluetooth/DeviceManager';
import {Status} from '../../bluetooth/Status';
import SSStyles from '../../styles/common-styles';

class HomePage extends React.Component {
  constructor() {
    super();
    this.manager = new DeviceManager();
    this.state = {
      info: '',
      connected: false,
      values: '',
      buttonEnabled: false,
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
    this.manager.statusEmitter.addListener(
      'changeStatus',
      this.changeStatusToast,
    );
  }

  componentWillUnmount(): void {
    this.manager.statusEmitter.removeListener('changeStatus');
  }

  changeStatusToast = (status, extra) => {
    console.log('Received ' + status);
    let text = '';
    let type = 'default';
    switch (status) {
      case Status.CONNECTED: {
        type = 'success';
        text = 'Connected to ' + extra;
        this.setState({buttonEnabled: true});
        break;
      }
      case Status.SCANNING: {
        text = 'Scanning for Smart Soles';
        break;
      }
      case Status.NOT_CONNECTED: {
        type = 'danger';
        text = 'Lost connection to Smart Soles';
        this.setState({buttonEnabled: false});
        break;
      }
    }
    Toast.show({
      text: text,
      duration: 3000,
      position: 'top',
      type: type,
    });
  };

  assessBalance() {
    this.manager.receiveNotifications().then(score => {
      this.setState({balance: score});
    });
  }

  render() {
    return (
      <Container>
        <HomeHeader />
        <Content
          contentContainerStyle={{
            flex: 1,
          }}>
          <Grid style={{padding: 20}}>
            <Row size={1}>
              <H3>Your balance</H3>
            </Row>
            <Row size={5}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <TouchableOpacity
                  disabled={!this.state.buttonEnabled}
                  onPress={() => {
                    this.assessBalance();
                  }}
                  style={
                    !this.state.buttonEnabled
                      ? SSStyles.disabledButton
                      : SSStyles.roundButton
                  }>
                  <Text style={SSStyles.buttonText}>Assess balance</Text>
                </TouchableOpacity>
              </View>
            </Row>
          </Grid>
        </Content>
      </Container>
    );
  }
}

export default HomePage;
