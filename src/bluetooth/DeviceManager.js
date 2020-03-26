import {BleManager} from 'react-native-ble-plx';
import {EventRegister} from 'react-native-event-listeners';

import Soles from './Soles';
import {Buffer} from 'buffer';
import {Status} from './Status';

export default class DeviceManager {
  constructor() {
    this.bleManager = new BleManager();
    this.soles = new Soles();
    this.index = 0;
    this.state = {
      status: Status.NOT_CONNECTED,
    };

    this.serviceUUID = '13386e50-5384-11ea-8d77-2e728ce88125';
    this.characteristicUUID = '133870f8-5384-11ea-8d77-2e728ce88125';
  }

  statusChange = (status, extra) => {
    this.state.status = status;
    EventRegister.emit('changeStatus', {status: status, extra: extra});
  };

  connectSmartSoles = () => {
    this.bleManager.onStateChange(state => {
      if (state === 'PoweredOn') {
        return this.findAndConnect();
      }
    });

    return this.bleManager.state().then(state => {
      if (state !== 'PoweredOn') {
        EventRegister.emit('error', 'Bluetooth needs to be turned on');
        return Promise.resolve();
      } else {
        return this.findAndConnect();
      }
    });
  };

  findAndConnect = async () => {
    try {
      let devices = await this.bleManager.connectedDevices([this.serviceUUID]);
      await devices.forEach(async device => {
        if (device.name.includes('SmartSole')) {
          await this.connectSole(device);
        }
      });
    } catch (err) {
      EventRegister.emit('error', err.message);
    }
    if (!this.soles.connected()) {
      await this.scanAndConnect();
    }
  };

  scanAndConnect = () => {
    let discovered = [];
    this.statusChange(Status.SCANNING);

    return this.bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        EventRegister.emit('error', 'startDeviceScan:' + error.message);
        return;
      }
      if (
        device &&
        device.name &&
        device.name.includes('SmartSole') &&
        !discovered.includes(device.id)
      ) {
        discovered.push(device.id);
        return this.connectSole(device);
      }
    });
  };

  connectSole = async device => {
    try {
      let connected,
        err = await device.isConnected();
      if (err) {
        EventRegister.emit('error', 'isConnected:' + err.message);
        return;
      }
      let connectedDev = device;
      if (!connected) {
        connectedDev = await device.connect();
      }
      await connectedDev.discoverAllServicesAndCharacteristics();
      console.log(device.name + ' ready to receive data');
      this.soles.add(device);
      if (this.soles.connected()) {
        this.statusChange(Status.CONNECTED, device.name);
        this.bleManager.stopDeviceScan();
        device.onDisconnected(() => {
          EventRegister.emit('error', 'Smart Sole disconnected');
          this.statusChange(Status.NOT_CONNECTED);
          return this.findAndConnect();
        });
      } else {
        this.statusChange(Status.CONNECTING, device.name);
      }
    } catch (err) {
      EventRegister.emit('error', 'connectSole: ' + err.message);
    }
  };

  receiveNotifications = async () => {
    this.setStatus(Status.READING);
    let promises = [];
    let subs = [];

    const service = this.serviceUUID;
    const characteristicN = this.characteristicUUID;

    this.soles.getSoles().forEach(device => {
      let fsrData = [];

      promises.push(
        new Promise((resolve, reject) => {
          let sub = device.monitorCharacteristicForService(
            service,
            characteristicN,
            (error, characteristic) => {
              if (error) {
                return reject({error: error, subscription: sub});
              }
              fsrData.push(
                this.parseNotification(device.name, characteristic.value),
              );
              if (this.getStatus() !== Status.READING) {
                resolve({device: device, subscription: sub, data: fsrData});
              }
            },
          );
          subs.push(sub);
        }),
      );
    });
    return Promise.all(promises).then(
      values => {
        let fsrDataArr = {};
        values.forEach(res => {
          fsrDataArr[res.device.name] = res.data;
        });
        subs.forEach(sub => sub.remove());
        return fsrDataArr;
      },
      err => {
        EventRegister.emit('error', err.error.message);
        subs.forEach(sub => sub.remove());
        err.subscription.remove();
      },
    );
  };

  getStatus = () => {
    return this.state.status;
  };

  setStatus = status => {
    this.state.status = status;
  };

  parseNotification(name, encodedBuf) {
    let fsrData = [];
    let byteBuf = Buffer.from(encodedBuf, 'base64');
    for (let i = 0; i < byteBuf.length - 1; i += 2) {
      fsrData.push(byteBuf.readInt16LE(i));
    }
    console.log(fsrData);
    if (!(this.index % 10)) {
      EventRegister.emit('data', {sole: name, data: fsrData});
    }
    this.index++;
    return fsrData;
  }
}
