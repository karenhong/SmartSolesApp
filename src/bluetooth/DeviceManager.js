import {BleManager} from 'react-native-ble-plx';

import NetworkManager from './NetworkManager';
import Soles from './Soles';
import {Buffer} from 'buffer';

export default class DeviceManager {
  constructor() {
    this.bleManager = new BleManager();
    this.networkManger = new NetworkManager();
    this.soles = new Soles();

    // Default UUID for custom service
    this.prefixUUID = '0000ffe';
    this.suffixUUID = '-0000-1000-8000-00805f9b34fb';
    this.serviceUUID1 = '13386e50-5384-11ea-8d77-2e728ce88125';

    this.fsrDataLength = 51;
    this.tempfsrData = [];
  }

  scanAndConnect = () => {
    this.bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        this.error(error.message);
        return;
      }

      if (device && device.name && device.name.includes('SmartSole')) {
        this.bleManager.stopDeviceScan();
        device
          .isConnected()
          .then((connected, error) => {
            if (!connected) {
              return device.connect();
            }
            if (error) {
              this.error(error.message);
            }
          })
          .then(device => {
            this.info('Connected to ' + device.name);
            this.info('Discovering services and characteristics');
            return device.discoverAllServicesAndCharacteristics();
          })
          .then(device => {
            this.info(device.name + ' ready to receive data');
            this.soles.add(device);
            if (this.soles.connected()) {
              this.bleManager.stopDeviceScan();
            }
          });
      }
    });
  };

  async receiveNotifications() {
    let promises = [];

    const service = this.serviceUUID();
    const characteristicN = this.notifyUUID();

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
    this.tempfsrData = fsrData;
    return fsrData;
  }

  info(message) {
    console.log(message);
  }

  error(message) {
    console.log('ERROR: ' + message);
  }

  serviceUUID() {
    return this.serviceUUID1;
    // return this.prefixUUID + '0' + this.suffixUUID;
  }

  notifyUUID() {
    return '133870f8-5384-11ea-8d77-2e728ce88125';
    // return this.prefixUUID + '1' + this.suffixUUID;
  }

  writeUUID() {
    return this.prefixUUID + '2' + this.suffixUUID;
  }
}
