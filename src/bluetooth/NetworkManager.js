export default class NetworkManager {
  constructor() {
    this.baseUrl =
      'https://smartsoles-inferenceserver.herokuapp.com/smartsoles';
    this.dataCollectionUrl =
      'https://smartsoles-trainingserver.herokuapp.com/upload';
  }

  async getBalanceScore(fsrData) {
    try {
      let response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: fsrData,
        }),
      });
      let responseJson = await response.json();
      return responseJson.result;
    } catch (error) {
      console.log(error);
      return '... (there was an error, please try again';
    }
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
