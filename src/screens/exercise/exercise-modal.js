import React, {Component} from 'react';
import {Modal, Text, StyleSheet} from 'react-native';
import {Icon} from 'native-base';
import {Button, Container} from 'native-base';
import {Row} from 'react-native-easy-grid';
import Video from 'react-native-video';

import SSColors from '../../styles/colors';

var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

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
          <Row style={{height: 55}}>
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
            <Video
              source={this.props.videoUrl}
              ref={ref => {
                this.player = ref;
              }} // Store reference
              onBuffer={this.onBuffer} // Callback when remote video is buffering
              onError={this.videoError} // Callback when video cannot be loaded
              // Later on in your styles..
              style={styles.backgroundVideo}
            />
          </Row>
          <Row>
            <Text>World</Text>
          </Row>
        </Container>
      </Modal>
    );
  }
}
