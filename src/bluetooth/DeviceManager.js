import {BleManager} from 'react-native-ble-plx';

import NetworkManager from './NetworkManager';
import Soles from './Soles';

export default class DeviceManager {
  // Default UUID for custom service

  constructor() {
    this.bleManager = new BleManager();
    this.networkManger = new NetworkManager();
    this.soles = new Soles();
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

    for (let device in [this.soles.left]) {
      let device = this.soles.left;
      let fsrData = [];
      promises.push(
        new Promise((resolve, reject) => {
          let subscription = device.monitorCharacteristicForService(
            service,
            characteristicN,
            (error, characteristic) => {
              if (error) {
                this.error(error.message);
                return reject;
              }
              this.info('Received notification from: ' + characteristic.uuid);
              fsrData.push(this.parseNotification(characteristic.value));
              if (fsrData.length === this.fsrDataLength) {
                resolve(subscription, fsrData);
              }
            },
          );
        }),
      );
    }
    return Promise.all(promises)
      .then(values => {
        let fsrDataArr = [];
        for (let res in values) {
          values[0].remove(); // Remove subscription from notifications
          fsrDataArr.push(values[1]);
        }
        return this.networkManger.getBalanceScore(fsrDataArr);
      })
      .then(score => {
        return Promise.resolve(score);
      });
  }

  parseNotification(fsrData) {
    return [fsrData];
  }

  info(message) {
    // this.setState({info: message});
    console.log(message);
  }

  error(message) {
    // this.setState({info: 'ERROR: ' + message});
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
