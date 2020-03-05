export default class NetworkManager {
  constructor() {
    this.baseUrl =
      'https://smartsoles-inferenceserver.herokuapp.com/smartsoles';
    this.dataCollectionUrl =
      'https://smartsoles-trainingserver.herokuapp.com/upload';
  }

  async getBalanceScore(fsrData) {
    let jsonData = JSON.stringify({
      right: fsrData.SmartSoleR ? fsrData.SmartSoleR : [[]],
      left: fsrData.SmartSoleL ? fsrData.SmartSoleL : [[]],
    });

    let response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: jsonData,
    });

    let responseJson = await response.json();
    return responseJson.balance;
  }

  async sendTestData(title, label, fsrData) {
    let jsonData = JSON.stringify({
      label: label,
      title: title,
      'Right Foot': {
        data: fsrData.SmartSoleR ? fsrData.SmartSoleR : [[]],
      },
      'Left Foot': {
        data: fsrData.SmartSoleL ? fsrData.SmartSoleL : [[]],
      },
    });

    console.log(jsonData);

    let response = await fetch(this.dataCollectionUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: jsonData,
    });

    if (response.status !== 200) {
      throw {
        message: 'Error sending data to server. Status: ' + response.status,
      };
    }
  }
}
