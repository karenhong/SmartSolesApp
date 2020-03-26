import React, {Component} from 'react';
import {Modal, Image} from 'react-native';
import {Icon} from 'native-base';
import {Button, Container} from 'native-base';
import {Row, Col} from 'react-native-easy-grid';
import Video from 'react-native-video';

import SSColors from '../../styles/colors';
import styles from '../../styles/soles-styles';

export default class ExerciseModal extends Component {
  onNewData = data => {
    console.log(data);
  };

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.modalVisible}
        onRequestClose={() => {
          this.props.stop();
        }}>
        <Container>
          <Row style={{height: 55}}>
            <Button
              transparent
              light
              large
              onPress={() => {
                this.props.stop();
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
              style={styles.backgroundVideo}
            />
          </Row>
          <Row style={{paddingTop: 20}}>
            <Col />
            <Col>
              <Container style={styles.leftSole}>
                <Image
                  source={require('../../../resources/soles/left/top.png')}
                  style={styles.ltop}
                />
                <Image
                  source={require('../../../resources/soles/left/left.png')}
                  style={styles.lleft}
                />
                <Image
                  source={require('../../../resources/soles/left/right.png')}
                  style={styles.lright}
                />
                <Image
                  source={require('../../../resources/soles/left/bottom.png')}
                  style={styles.lbottom}
                />
              </Container>
            </Col>
            <Col>
              <Container style={styles.rightSole}>
                <Image
                  source={require('../../../resources/soles/right/top.png')}
                  style={styles.rtop}
                />
                <Image
                  source={require('../../../resources/soles/right/left.png')}
                  style={styles.rleft}
                />
                <Image
                  source={require('../../../resources/soles/right/right.png')}
                  style={styles.rright}
                />
                <Image
                  source={require('../../../resources/soles/right/bottom.png')}
                  style={styles.rbottom}
                  tintColor="none"
                />
              </Container>
            </Col>
            <Col />
          </Row>
        </Container>
      </Modal>
    );
  }
}
