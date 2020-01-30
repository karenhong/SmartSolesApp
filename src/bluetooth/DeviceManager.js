import {BleManager} from 'react-native-ble-plx';
import {decode as atob} from 'base-64';

import NetworkManager from './NetworkManager';
import Soles from './Soles';
import {Buffer} from 'buffer';

export default class DeviceManager {
  constructor() {
    this.bleManager = new BleManager();
    this.networkManger = new NetworkManager();
    this.soles = new Soles();

    // Default UUID for custom service
    this.prefixUUID = '0000ff';
    this.suffixUUID = '-0000-1000-8000-00805f9b34fb';

    this.fsrDataLength = 3;
  }

  scanAndConnect = () => {
    this.bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        this.error(error.message);
        return;
      }

      if (device && device.name && device.name.includes('SmartSole')) {
        this.bleManager.stopDeviceScan(); // TODO: Move this bc you need to scan for 2 soles
        this.info('Connecting to Smart Sole');
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
            this.info('Connected to Smart Sole');
            this.info('Discovering services and characteristics');
            return device.discoverAllServicesAndCharacteristics();
          })
          .then(device => {
            this.soles.add(device);
          });
      }
    });
  };

  async receiveNotifications() {
    let promises = [];

    const service = this.serviceUUID('e'); // TODO: Figure out where this number is coming from and if it's different for each chip
    const characteristicN = this.notifyUUID('e');

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
              this.info('Received notification from: ' + characteristic.uuid);
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
    for (let i = 0; i < byteBuf.length; i += 2) {
      fsrData.push(byteBuf.readInt16LE(i));
    }
    return fsrData;
  }

  info(message) {
    console.log(message);
  }

  error(message) {
    console.log('ERROR: ' + message);
  }

  serviceUUID(num) {
    return this.prefixUUID + num + '0' + this.suffixUUID;
  }

  notifyUUID(num) {
    return this.prefixUUID + num + '1' + this.suffixUUID;
  }

  writeUUID(num) {
    return this.prefixUUID + num + '2' + this.suffixUUID;
  }
}
