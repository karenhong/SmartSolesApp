import {Device} from 'react-native-ble-plx';

export default class Soles {
  left: Device;
  right: Device;

  add(device, emitter) {
    if (device.name === 'SmartSoleL') {
      this.left = device;
    } else if (device.name === 'SmartSoleR') {
      this.right = device;
    }

    device.onDisconnected(device.id, (err, device) => {
      emitter.emit('error', err);
      if (device.id === this.left.id) {
        this.left = null;
      }

      if (device.id === this.right.id) {
        this.right = null;
      }

      device.removeListener(device.id);
    });
  }

  connected() {
    return this.left && this.right;
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
