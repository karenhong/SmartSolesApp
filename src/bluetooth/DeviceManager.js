import {BleManager} from 'react-native-ble-plx';
import {EventRegister} from 'react-native-event-listeners';

import NetworkManager from './NetworkManager';
import Soles from './Soles';
import {Buffer} from 'buffer';
import {Status} from './Status';

export default class DeviceManager {
  constructor() {
    this.bleManager = new BleManager();
    this.networkManger = new NetworkManager();
    this.soles = new Soles();
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
        EventRegister.emit('error', error.message);
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
        EventRegister.emit('error', err.message);
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
      EventRegister.emit('error', err.message);
    }
  };

  receiveNotifications = async () => {
    let promises = [];

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
                return reject(error);
              }
              fsrData.push(this.parseNotification(characteristic.value));
              if (this.getStatus() !== Status.READING) {
                sub.remove();
                resolve({device: device, data: fsrData});
                EventRegister.emit('data', '');
              }
            },
          );
        }),
      );
    });
    return Promise.all(promises)
      .then(
        values => {
          let fsrDataArr = {};
          values.forEach(res => {
            fsrDataArr[res.device.name] = res.data;
          });
          return this.networkManger.getBalanceScore(fsrDataArr);
        },
        error => {
          EventRegister.emit('data', '');
          EventRegister.emit('error', error.message);
        },
      )
      .then(score => {
        return Promise.resolve(score);
      });
  };

  getStatus = () => {
    return this.state.status;
  };

  setStatus = status => {
    this.state.status = status;
  };

  parseNotification(encodedBuf) {
    let fsrData = [];
    let byteBuf = Buffer.from(encodedBuf, 'base64');
    for (let i = 0; i < byteBuf.length - 1; i += 2) {
      fsrData.push(byteBuf.readInt16LE(i));
    }
    console.log(fsrData);
    EventRegister.emit('data', fsrData.toString());
    return fsrData;
  }
}
