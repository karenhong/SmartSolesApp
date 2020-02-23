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

  async findAndConnect() {
    try {
      let devices = await this.bleManager.connectedDevices([this.serviceUUID]);
      for (let device in devices) {
        if (device.name.includes('SmartSole')) {
          await this.connectSole(device);
        }
      }
    } catch (err) {
      EventRegister.emit('error', err.message);
    }
    if (!this.soles.connected()) {
      return this.scanAndConnect();
    }
  }

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

  connectSole = device => {
    return device
      .isConnected()
      .then(
        (connected, error) => {
          if (!connected) {
            return device.connect();
          }
          if (error) {
            console.log(error);
          }
          return Promise.resolve(device);
        },
        err => EventRegister.emit('error', err.message),
      )
      .then(
        device => {
          return device.discoverAllServicesAndCharacteristics();
        },
        err => EventRegister.emit('error', err.message),
      )
      .then(
        device => {
          console.log(device.name + ' ready to receive data');
          this.soles.add(device);
          if (this.soles.connected()) {
            console.log('Stopped scanning');
            this.statusChange(Status.CONNECTED, device.name);
            this.bleManager.stopDeviceScan();
            device.onDisconnected((err, device) => {
              EventRegister.emit('error', device.name + ' disconnected');
              this.statusChange(Status.NOT_CONNECTED);
            });
          } else {
            this.statusChange(Status.CONNECTING, device.name);
          }
        },
        err => EventRegister.emit('error', err.message),
      );
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
                resolve(fsrData);
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
          let fsrDataArr = [];
          values.forEach(res => {
            res.subscription.remove(); // Stop subscribing to the notifications
            fsrDataArr.push(res);
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
