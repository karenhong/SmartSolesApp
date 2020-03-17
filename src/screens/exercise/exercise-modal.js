import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View} from 'react-native';
import {Icon} from 'native-base';
import {Button, Container, H3} from 'native-base';
import {Row, Grid} from 'react-native-easy-grid';

import SSColors from '../../styles/colors';

export default class ExerciseModal extends Component {
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.modalVisible}
        onRequestClose={() => {
          this.props.setModalVisible(!this.props.modalVisible);
        }}>
        <Container>
          <Row style={{height: 45}}>
            <Button
              transparent
              light
              large
              onPress={() => {
                this.props.setModalVisible(!this.props.modalVisible);
              }}>
              <Icon
                style={[{color: SSColors.Gray}]}
                size={20}
                type="MaterialCommunityIcons"
                name="keyboard-backspace"
              />
            </Button>
          </Row>
          <Row>
            <Text>Hello</Text>
          </Row>
          <Row>
            <Text>World</Text>
          </Row>
        </Container>
      </Modal>
    );
  }
}
