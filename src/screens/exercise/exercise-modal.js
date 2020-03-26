import React, {Component} from 'react';
import {Modal, Image} from 'react-native';
import {Icon} from 'native-base';
import {Button, Container} from 'native-base';
import {Row, Col} from 'react-native-easy-grid';
import Video from 'react-native-video';

import SSColors from '../../styles/colors';
import styles from '../../styles/soles-styles';

export default class ExerciseModal extends Component {

  LightenDarkenColor(col, amt) {

    var usePound = false;

    if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);

  }

  darkest = "#003399";
  dark = "#003399";
  light = "#66FF99";
  delay = 2;

  onNewData = data => {
    console.log(data);

    if (this.state.i > this.delay) {
      this.setState(
          {
            ltopTint: this.LightenDarkenColor(this.darkest, -100 + (this.state.i - this.delay) * 2),
            lleftTint: this.LightenDarkenColor(this.state.lleftTint, -2),
            lrightTint: this.LightenDarkenColor(this.darkest, - 10 - (this.state.i - this.delay) * 1),
            lbottomTint: this.LightenDarkenColor(this.state.lbottomTint, -10),
            rtopTint: this.LightenDarkenColor(this.state.rtopTint, 10),
            rleftTint: this.LightenDarkenColor(this.state.rleftTint, -2),
            rrightTint: this.LightenDarkenColor(this.state.rrightTint, -2),
            rbottomTint: this.LightenDarkenColor(this.state.rbottomTint, -10),
          });
    }
    if (this.state.i === this.delay) {
      this.setState(
          {
            ltopTint: this.LightenDarkenColor(this.darkest, -20),
            lleftTint: "#3366CC",
            lrightTint:  this.LightenDarkenColor(this.darkest, -10),
            lbottomTint: "#999999",
            rtopTint: this.LightenDarkenColor("#003399", -50),
            rleftTint: this.LightenDarkenColor("#003399", -20),
            rrightTint: this.LightenDarkenColor("#003399", 0),
            rbottomTint: this.LightenDarkenColor("#999999", 0),
          });
    }

    this.state.i++;
  };

  state = {
    ltopActivated: 1,
    lleftActivated: 1,
    lrightActivated: 1,
    lbottomActivated: 1,
    rtopActivated: 1,
    rleftActivated: 1,
    rrightActivated: 1,
    rbottomActivated: 1,

    ltopTint: "none",
    lleftTint: "none",
    lrightTint: "none",
    lbottomTint: "none",
    rtopTint: "none",
    rleftTint: "none",
    rrightTint: "none",
    rbottomTint: "none",

    i: 0
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
                  tintColor={this.state.ltopTint}
                />
                <Image
                  source={require('../../../resources/soles/left/left.png')}
                  style={styles.lleft}
                  tintColor={this.state.lleftTint}
                />
                <Image
                  source={require('../../../resources/soles/left/right.png')}
                  style={styles.lright}
                  tintColor={this.state.lrightTint}
                />
                <Image
                  source={require('../../../resources/soles/left/bottom.png')}
                  style={styles.lbottom}
                  tintColor={this.state.lbottomTint}
                />
              </Container>
            </Col>
            <Col>
              <Container style={styles.rightSole}>
                <Image
                  source={require('../../../resources/soles/right/top.png')}
                  style={styles.rtop}
                  tintColor={this.state.rtopTint}
                />
                <Image
                  source={require('../../../resources/soles/right/left.png')}
                  style={styles.rleft}
                  tintColor={this.state.rleftTint}
                />
                <Image
                  source={require('../../../resources/soles/right/right.png')}
                  style={styles.rright}
                  tintColor={this.state.rrightTint}
                />
                <Image
                  source={require('../../../resources/soles/right/bottom.png')}
                  style={styles.rbottom}
                  tintColor={this.state.rbottomTint}
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
