export default class NetworkManager {
  baseUrl: 'https://smartsoles-inferenceserver.herokuapp.com/smartsoles';

  async getBalanceScore(data) {
    return new Promise((resolve, reject) => resolve('bad'));
  }
}
