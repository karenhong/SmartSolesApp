import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Container, Content, H3, Toast, Root} from 'native-base';
import {Row, Grid} from 'react-native-easy-grid';
import {EventRegister} from 'react-native-event-listeners';
import {Circle} from 'react-native-progress';

import HomeHeader from './header';
import DeviceManager from '../../bluetooth/DeviceManager';
import NetworkManager from '../../bluetooth/NetworkManager';
import {Status} from '../../bluetooth/Status';
import SSStyles from '../../styles/common-styles';
import SSColors from '../../styles/colors';

class HomePage extends React.Component {
  _isMounted = false;

  constructor() {
    super();
    this.manager = new DeviceManager();
    this.networkManger = new NetworkManager();
    this.state = {
      enabled: false,
      connected: false,
      showToast: false,
      buttonText: 'Start',
      balance: 0,
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

    this.manager.connectSmartSoles();

    this.changeStatusToast(Status.SCANNING);
  }

  componentWillUnmount(): void {
    this._isMounted = false;

    Toast.toastInstance = null;
    EventRegister.removeEventListener(this.errorListener);
    EventRegister.removeEventListener(this.statusListener);
  }

  updateState = state => {
    if (this._isMounted) {
      this.setState(state);
    }
  };

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

  startAssessBalance = () => {
    this.manager
      .receiveNotifications()
      .then(
        fsrDataArr => {
          return this.networkManger.getBalanceScore(fsrDataArr);
        },
        error => {
          this.errorToast('getBalanceScore: ' + error.message);
        },
      )
      .then(score => {
        this.updateState({balance: score});
        this.updateState({enabled: true});
        this.updateState({buttonText: 'Start'});
        this.manager.setStatus(Status.CONNECTED);
      });
  };

  collectData = () => {
    this.manager
      .receiveNotifications()
      .then(fsrDataArr => {
        return this.networkManger.sendTestData(
          this.state.title,
          this.state.label,
          fsrDataArr,
        );
      })
      .then(() => {
        Toast.show({
          text: 'Data successfully uploaded',
          duration: 3000,
          position: 'center',
          type: 'success',
        });
      })
      .catch(error => this.errorToast(error.message));
  };

  render() {
    return (
      <Root>
        <Container>
          <HomeHeader connected={this.state.connected} />
          <Content
            contentContainerStyle={{
              flex: 1,
            }}>
            <Grid style={{padding: 20}}>
              <Row size={1}>
                <H3 style={{fontWeight: 'bold', color: SSColors.darkGray}}>
                  Your balance
                </H3>
              </Row>
              <Row size={7}>
                <View style={SSStyles.container}>
                  <View style={SSStyles.behind}>
                    <Circle
                      size={280}
                      thickness={40}
                      indeterminate={false}
                      progress={this.state.balance}
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
            </Grid>
          </Content>
        </Container>
      </Root>
    );
  }
}

export default HomePage;
