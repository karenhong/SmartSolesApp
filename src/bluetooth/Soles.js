import {Device} from 'react-native-ble-plx';

export default class Soles {
  left: Device;
  right: Device;

  add(device) {
    if (device.name === 'SmartSoleL') {
      this.left = device;
    } else if (device.name === 'SmartSoleR') {
      this.right = device;
    }
  }

  *[Symbol.iterator]() {
    if (this.left) {
      yield this.left;
    }
    if (this.right) {
      yield this.right;
    }
  }
}
