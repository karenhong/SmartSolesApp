import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Container, Content, H3, Toast, Root} from 'native-base';
import {Row, Grid} from 'react-native-easy-grid';
import {EventRegister} from 'react-native-event-listeners';
import {Circle} from 'react-native-progress';

import HomeHeader from './header';
import DeviceManager from '../../bluetooth/DeviceManager';
import {Status} from '../../bluetooth/Status';
import SSStyles from '../../styles/common-styles';
import SSColors from '../../styles/colors';

class HomePage extends React.Component {
  _isMounted = false;

  constructor() {
    super();
    this.manager = new DeviceManager();
    this.state = {
      enabled: false,
      showToast: false,
      buttonText: 'Start',
      data: '',
    };
  }

  componentDidMount() {
    this._isMounted = true;

    this.errorListener = EventRegister.addEventListener('error', errMsg => {
      Toast.show({
        text: errMsg,
        duration: 3000,
        position: 'center',
        type: 'danger',
      });
    });
    this.statusListener = EventRegister.addEventListener(
      'changeStatus',
      this.changeStatusToast,
    );

    this.dataListener = EventRegister.addEventListener('data', data => {
      this.updateState({data: data});
    });

    this.manager.connectSmartSoles();

    this.changeStatusToast(Status.SCANNING);
  }

  componentWillUnmount(): void {
    this._isMounted = false;

    Toast.toastInstance = null;
    EventRegister.removeEventListener(this.errorListener);
    EventRegister.removeEventListener(this.statusListener);
    EventRegister.removeEventListener(this.dataListener);
  }

  updateState = state => {
    if (this._isMounted) {
      this.setState(state);
    }
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
        break;
    }
    Toast.show({
      text: text,
      duration: duration,
      position: 'center',
      type: type,
    });
  };

  startAssessBalance() {
    this.manager.setStatus(Status.READING);
    this.manager.receiveNotifications().then(score => {
      this.updateState({balance: score});
      this.updateState({enabled: true});
      this.updateState({buttonText: 'Start'});
      this.manager.setStatus(Status.CONNECTED);
    });
  }

  render() {
    return (
      <Root>
        <Container>
          <HomeHeader connected={this.state.enabled} />
          <Content
            contentContainerStyle={{
              flex: 1,
            }}>
            <Grid style={{padding: 20}}>
              <Row size={1}>
                <H3 style={{fontWeight: 'bold', color: SSColors.darkGray}}>Your balance</H3>
              </Row>
              <Row size={5}>
                <View style={SSStyles.container}>
                  <View style={SSStyles.behind}>
                    <Circle
                      size={280}
                      thickness={40}
                      indeterminate={false}
                      progress={0.2}
                      strokeCap={'round'}
                      color={SSColors.accent}
                      unfilledColor={SSColors.lightGray}
                      borderWidth={0}
                    />
                  </View>
                  <View style={SSStyles.center}>
                    <TouchableOpacity
                      disabled={!this.state.enabled}
                      zIndex={5}
                      onPress={() => {
                        if (this.manager.getStatus() === Status.READING) {
                          this.manager.setStatus(Status.GETTING_BALANCE);
                          this.updateState({enabled: false});
                        } else {
                          this.updateState({buttonText: 'Stop'});
                          this.startAssessBalance();
                        }
                      }}
                      style={
                        !this.state.enabled
                          ? SSStyles.disabledButton
                          : SSStyles.roundButton
                      }>
                      <Text style={SSStyles.buttonText}>
                        {this.state.buttonText}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Row>
              <Row size={1}>
                <Text>{this.state.data}</Text>
              </Row>
            </Grid>
          </Content>
        </Container>
      </Root>
    );
  }
}

export default HomePage;
