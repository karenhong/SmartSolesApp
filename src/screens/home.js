import React from 'react';
import {View, Text, Platform} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';

class HomePage extends React.Component {
  constructor() {
    super();
    this.manager = new BleManager();
    this.state = {info: '', connected: false, values: ''};
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      this.manager.onStateChange(state => {
        if (state === 'PoweredOn') {
          this.scanAndConnect();
        }
      });
    } else {
      this.scanAndConnect();
    }
  }

  scanAndConnect = () => {
    this.manager.startDeviceScan(null, null, (error, device) => {
      this.info('Scanning');

      if (error) {
        this.error(error.message);
        return;
      }

      if (device && device.name && device.name.includes('SmartSole')) {
        this.manager.stopDeviceScan();
        this.info('Connecting to Smart Sole');
        device
          .connect()
          .then(device => {
            this.info('Connected to Smart Sole');
            this.setState({connected: true});
            this.info('Discovering services and characteristics');
            return device.discoverAllServicesAndCharacteristics();
          })
          .then(device => {
            this.info('Setting notifications');
            return this.setupNotifications(device);
          })
          .then(
            () => {
              this.info('Listening...');
            },
            error => {
              this.error(error.message);
            },
          );
      }
    });
  };

  async setupNotifications(device) {
    const service = '0000ffe0-0000-1000-8000-00805f9b34fb';
    const characteristicW = '0000ffe2-0000-1000-8000-00805f9b34fb';
    const characteristicN = '0000ffe1-0000-1000-8000-00805f9b34fb';

    // const characteristic = await device.writeCharacteristicWithResponseForService(
    //   service,
    //   characteristicW,
    //   'AQ==' /* 0x01 in hex */,
    // );

    device.monitorCharacteristicForService(
      service,
      characteristicN,
      (error, characteristic) => {
        if (error) {
          this.error(error.message);
          return;
        }
        this.info('Received notifiation from: ' + characteristic.uuid);
        this.setState({values: characteristic.value});
      },
    );
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

  info(message) {
    this.setState({info: message});
  }

  error(message) {
    this.setState({info: 'ERROR: ' + message});
  }

  render() {
    return (
      <View>
        <Text>{this.state.info}</Text>
        <Text>Connected: {String(this.state.connected)}</Text>
        <Text>Read from device: {this.state.values}</Text>
      </View>
    );
  }
}

export default HomePage;
