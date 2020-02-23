import React from 'react';
import {View, Text, Platform, TouchableOpacity} from 'react-native';
import {Container, Content, H3, Toast, Root} from 'native-base';
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
      showToast: false,
    };
  }

  componentDidMount() {
    this.manager.statusEmitter.addListener('error', errMsg => {
      Toast.show({
        text: errMsg,
        duration: 3000,
        position: 'top',
        type: 'danger',
      });
    });
    this.manager.statusEmitter.addListener(
      'changeStatus',
      this.changeStatusToast,
    );
    if (Platform.OS === 'ios') {
      this.manager.bleManager.onStateChange(state => {
        if (state === 'PoweredOn') {
          this.manager.connectSmartSoles();
        }
      });
    } else {
      this.manager.connectSmartSoles();
    }
    this.changeStatusToast(Status.SCANNING);
  }

  componentWillUnmount(): void {
    Toast.toastInstance = null;
    this.manager.statusEmitter.removeListener('changeStatus');
    this.manager.statusEmitter.removeListener('error');
  }

  changeStatusToast = (status, extra) => {
    let text = '';
    let type = 'default';
    let duration = 3000;
    switch (status) {
      case Status.CONNECTED:
        type = 'success';
        text = 'Connected to Smart Soles';
        this.setState({buttonEnabled: true});
        break;
      case Status.CONNECTING:
        type = 'success';
        text = 'Connected to ' + extra;
        duration = 1000;
        break;
      case Status.SCANNING:
        text = 'Scanning for Smart Soles';
        break;
      case Status.NOT_CONNECTED:
        type = 'danger';
        text = 'Lost connection to Smart Soles';
        this.setState({buttonEnabled: false});
        break;
    }
    Toast.show({
      text: text,
      duration: duration,
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
      <Root>
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
      </Root>
    );
  }
}

export default HomePage;
