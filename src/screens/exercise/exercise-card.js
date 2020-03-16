import React, {Component} from 'react';
import {
  Alert,
  Image,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

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
  // https://www.youtube.com/watch?v=9hRRbq6wjKo
  // https://www.youtube.com/watch?v=i0uao-VKw9Q

  state = {
    modalVisible: false,
  };

  constructor(props) {
    super(props);
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

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
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
            <View style={{marginTop: 22}}>
              <View>
                <Text>Hello World!</Text>

                <TouchableHighlight
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Text>Hide Modal</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
        </Content>
      </Container>
    );
  }
}
