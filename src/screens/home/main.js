import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {H3} from 'native-base';
import {Row, Grid, Col} from 'react-native-easy-grid';
import {EventRegister} from 'react-native-event-listeners';
import {Circle} from 'react-native-progress';

import NetworkManager from '../../bluetooth/NetworkManager';
import {Status} from '../../bluetooth/Status';
import SSStyles from '../../styles/common-styles';
import SSColors from '../../styles/colors';

class HomePage extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.manager = this.props.deviceManager;
    // this.errorToast = this.props.errorToast;
    this.networkManger = new NetworkManager();
    this.state = {
      enabled: false,
      showToast: false,
      buttonText: 'Start',
      balance: 0,
    };
  }

  updateState = state => {
    if (this._isMounted) {
      this.setState(state);
    }
  };

  startAssessBalance = () => {
    this.manager
      .receiveNotifications()
      .then(fsrDataArr => {
        return this.networkManger.getBalanceScore(fsrDataArr);
      })
      .then(score => {
        console.log('Score is: ' + score);
        this.updateState({enabled: true});
        this.updateState({buttonText: 'Start'});
        this.manager.setStatus(Status.CONNECTED);
        this.updateState({balance: score});
        return score;
      })
      .catch(error => {
        console.log(error.message);
        // this.errorToast('Not enough data was collected');
        this.updateState({enabled: true});
        this.updateState({buttonText: 'Start'});
        this.manager.setStatus(Status.CONNECTED);
      });
  };

  render() {
    return (
      <Grid style={{padding: 20, backgroundColor: SSColors.background}}>
        <Row size={1}>
          <Col>
            <H3 style={{fontWeight: 'bold', color: SSColors.darkGray}}>
              Your balance
            </H3>
          </Col>
        </Row>
        <Row size={6}>
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
                    EventRegister.removeEventListener(this.dataListener);
                    this.updateState({enabled: false});
                    this.manager.setStatus(Status.GETTING_BALANCE);
                  } else {
                    this.updateState({buttonText: 'Stop'});
                    this.startAssessBalance();
                    this.updateState({balance: 0});
                  }
                }}
                style={
                  !this.state.enabled
                    ? SSStyles.disabledButton
                    : SSStyles.roundButton
                }>
                <Text style={SSStyles.buttonText}>{this.state.buttonText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Row>
      </Grid>
    );
  }
}

export default HomePage;
