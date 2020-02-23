import {BleManager} from 'react-native-ble-plx';
import {NativeEventEmitter} from 'react-native';

import NetworkManager from './NetworkManager';
import Soles from './Soles';
import {Buffer} from 'buffer';
import {Status} from './Status';

export default class DeviceManager {
  constructor() {
    this.statusEmitter = new NativeEventEmitter('changeStatus');

    this.bleManager = new BleManager();
    this.networkManger = new NetworkManager();
    this.soles = new Soles();
    this.state = {
      status: Status.NOT_CONNECTED,
    };

    this.serviceUUID = '13386e50-5384-11ea-8d77-2e728ce88125';
    this.characteristicUUID = '133870f8-5384-11ea-8d77-2e728ce88125';

    this.fsrDataLength = 51;
  }

  statusChange = (status, extra) => {
    this.state.status = status;
    this.statusEmitter.emit('changeStatus', status, extra);
  };

  connectSmartSoles = () => {
    return this.checkConnected().then(
      connected => {
        if (!connected) {
          return this.scanAndConnect();
        }
      },
      err => 'error checking connected ' + err,
    );
  };

  scanAndConnect = () => {
    let discovered = [];
    this.statusChange(Status.SCANNING);

    return this.bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        this.error(error.message);
        this.statusEmitter.emit('error', error.message);
        return;
      }
      if (
        device &&
        device.name &&
        device.name.includes('SmartSole') &&
        !discovered.includes(device.id)
      ) {
        discovered.push(device.id);
        return this.connectSole(device).then(
          () => {},
          err => this.statusEmitter.emit('error', err.message),
        );
      }
    });
  };

  async checkConnected() {
    try {
      let devices = await this.bleManager.connectedDevices([this.serviceUUID]);
      for (let device in devices) {
        if (device.name.includes('SmartSole')) {
          await this.connectSole(device);
        }
      }
    } catch (err) {
      this.statusEmitter.emit('error', err.message);
    }
    return Promise.resolve(this.soles.connected());
  }

  connectSole = device => {
    return device
      .isConnected()
      .then(
        (connected, error) => {
          if (!connected) {
            return device.connect();
          }
          if (error) {
            this.error(error.message);
          }
          console.log(device.id + ' already connected');
          return Promise.resolve(device);
        },
        err => this.statusEmitter.emit('error', err),
      )
      .then(
        device => {
          return device.discoverAllServicesAndCharacteristics();
        },
        err => this.statusEmitter.emit('error', err),
      )
      .then(
        device => {
          console.log(device.name + ' ready to receive data');
          this.soles.add(device, this.statusEmitter);
          if (this.soles.connected()) {
            console.log('Stopped scanning');
            this.statusChange(Status.CONNECTED, device.name);
            this.bleManager.stopDeviceScan();
          } else {
            this.statusChange(Status.CONNECTING, device.name);
          }
        },
        err => this.statusEmitter.emit('error', err),
      );
  };

  async receiveNotifications() {
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
                return reject(error.message);
              }
              fsrData.push(this.parseNotification(characteristic.value));
              if (fsrData.length === this.fsrDataLength) {
                resolve({subscription: sub, data: fsrData});
              }
            },
          );
        }),
      );
    });
    return Promise.all(promises)
      .then(values => {
        let fsrDataArr = [];
        values.forEach(res => {
          res.subscription.remove(); // Stop subscribing to the notifications
          fsrDataArr.push(res.data);
        });
        return this.networkManger.getBalanceScore(fsrDataArr);
      })
      .then(score => {
        return Promise.resolve(score);
      });
  }

  parseNotification(encodedBuf) {
    let fsrData = [];
    let byteBuf = Buffer.from(encodedBuf, 'base64');
    for (let i = 0; i < byteBuf.length - 1; i += 2) {
      fsrData.push(byteBuf.readInt16LE(i));
    }
    console.log(fsrData);
    return fsrData;
  }
}
