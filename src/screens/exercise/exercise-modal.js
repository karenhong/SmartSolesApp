import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Alert} from 'react-native';

export default class ExerciseModal extends Component {

  render() {
    return (
      <View style={{marginTop: 22}}>


        <TouchableHighlight
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Text>Show Modal</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
