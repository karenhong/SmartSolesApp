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

  render() {
    return (
      <Container>
        <Content>
          <TouchableOpacity
            activeOpacity={100}
            onPress={() => this.setModalVisible(true)}>
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
                <Button rounded accent>
                  <Text>{this.props.type}</Text>
                </Button>
              </CardItem>
            </Card>
          </TouchableOpacity>
          <ExerciseModal
            modalVisible={this.state.modalVisible}
            setModalVisible={this.setModalVisible}
          />
        </Content>
      </Container>
    );
  }
}
