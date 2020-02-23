import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Container, Content, H3, Toast, Root} from 'native-base';
import {Row, Grid} from 'react-native-easy-grid';
import {EventRegister} from 'react-native-event-listeners';

import HomeHeader from './header';
import DeviceManager from '../../bluetooth/DeviceManager';
import {Status} from '../../bluetooth/Status';
import SSStyles from '../../styles/common-styles';

class HomePage extends React.Component {
  constructor() {
    super();
    this.manager = new DeviceManager();
    this.state = {
      buttonEnabled: false,
      showToast: false,
      buttonText: 'Assess Balance',
    };
  }

  componentDidMount() {
    this.errorListener = EventRegister.addEventListener('error', errMsg => {
      Toast.show({
        text: errMsg,
        duration: 3000,
        position: 'top',
        type: 'danger',
      });
    });
    this.statusListener = EventRegister.addEventListener(
      'changeStatus',
      this.changeStatusToast,
    );

    this.manager.connectSmartSoles();

    this.changeStatusToast(Status.SCANNING);
  }

  componentWillUnmount(): void {
    Toast.toastInstance = null;
    EventRegister.removeEventListener(this.errorListener);
    EventRegister.removeEventListener(this.statusListener);
  }

  changeStatusToast = data => {
    let text = '';
    let type = 'default';
    let duration = 3000;
    switch (data.status) {
      case Status.CONNECTED:
        type = 'success';
        text = 'Connected to Smart Soles';
        this.setState({buttonEnabled: true});
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

  startAssessBalance() {
    this.manager.setStatus(Status.READING);
    this.manager.receiveNotifications().then(score => {
      this.setState({balance: score});
      this.setState({buttonEnabled: true});
      this.setState({buttonText: 'Assess Balance'});
      this.manager.setStatus(Status.CONNECTED);
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
                      if (this.manager.getStatus() === Status.READING) {
                        this.manager.setStatus(Status.GETTING_BALANCE);
                        this.setState({buttonEnabled: false});
                      } else {
                        this.setState({buttonText: 'Stop'});
                        this.startAssessBalance();
                      }
                    }}
                    style={
                      !this.state.buttonEnabled
                        ? SSStyles.disabledButton
                        : SSStyles.roundButton
                    }>
                    <Text style={SSStyles.buttonText}>
                      {this.state.buttonText}
                    </Text>
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
