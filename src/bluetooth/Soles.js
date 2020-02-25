import {Device} from 'react-native-ble-plx';

const TESTING_WITH_ONE = true;

export default class Soles {
  left: Device;
  right: Device;

  add(device) {
    if (device.name === 'SmartSoleL') {
      this.left = device;
    } else if (device.name === 'SmartSoleR') {
      this.right = device;
    }

    device.onDisconnected((err, dev) => {
      if (this.left && dev.id === this.left.id) {
        this.left = null;
      }

      if (this.right && dev.id === this.right.id) {
        this.right = null;
      }
    });
  }

  connected() {
    if (TESTING_WITH_ONE) {
      return !!(this.left || this.right);
    }
    return !!(this.left && this.right);
  }

  // TODO: figure out how to define an iterator instead
  getSoles() {
    let arr = [];
    if (this.left) {
      arr.push(this.left);
    }
    if (this.right) {
      arr.push(this.right);
    }
    return arr;
  }
}
