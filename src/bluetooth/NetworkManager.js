export default class NetworkManager {
  constructor() {
    this.baseUrl =
      'https://smartsoles-inferenceserver.herokuapp.com/smartsoles';
  }

  async getBalanceScore(fsrData) {
    let jsonData = JSON.stringify({
      right: fsrData.SmartSoleR ? fsrData.SmartSoleR : [[]],
      left: fsrData.SmartSoleL ? fsrData.SmartSoleL : [[]],
    });

    console.log(jsonData);

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
}
