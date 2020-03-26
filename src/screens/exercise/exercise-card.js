import React, {Component} from 'react';
import {Image, TouchableOpacity} from 'react-native';

import ExerciseModal from './exercise-modal';

import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  H2,
  Button,
} from 'native-base';
import {EventRegister} from 'react-native-event-listeners';
import {Status} from '../../bluetooth/Status';

export default class ExerciseCard extends Component {
  state = {
    modalVisible: false,
  };

  constructor(props) {
    super(props);
  }

  setModalVisible = visible => {
    this.setState({modalVisible: visible});
  };

  startExercise = () => {
    this.setModalVisible(true);
    this.dataListener = EventRegister.addEventListener(
      'data',
      this.onNewData,
    );
    this.props.deviceManager.receiveNotifications();
  };

  stopExercise = () => {
    this.setModalVisible(false);
    this.props.deviceManager.setStatus(Status.GETTING_BALANCE);
    EventRegister.removeEventListener(this.dataListener);
  };

  onNewData = (data) => {
    this.refs.exerciseModal.onNewData(data);
  };

  render() {
    return (
      <Container>
        <Content>
          <TouchableOpacity activeOpacity={100} onPress={this.startExercise}>
            <Card>
              <CardItem cardBody>
                <Image
                  source={this.props.imageUrl}
                  style={{height: 200, width: 500, flex: 1}}
                />
              </CardItem>
              <CardItem>
                <H2>{this.props.title}</H2>
              </CardItem>
              <CardItem>
                <Button rounded info>
                  <Text>{this.props.type}</Text>
                </Button>
              </CardItem>
            </Card>
          </TouchableOpacity>
          <ExerciseModal
            ref="exerciseModal"
            modalVisible={this.state.modalVisible}
            stop={this.stopExercise}
            videoUrl={this.props.videoUrl}
            deviceManger={this.props.deviceManager}
          />
        </Content>
      </Container>
    );
  }
}
