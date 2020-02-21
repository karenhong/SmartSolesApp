export default class NetworkManager {
  constructor() {
    this.baseUrl =
      'https://smartsoles-inferenceserver.herokuapp.com/smartsoles';
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
      // TODO: error checking
      let responseJson = await response.json();
      return responseJson.result;
    } catch (error) {
      console.log(error);
      return '... (there was an error, please try again';
    }
  }
}
