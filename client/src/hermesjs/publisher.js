const Web3Utils = require('web3-utils');
const Shh = require('web3-shh');

export default class Publisher {
  constructor(web3) {
    this.web3 = web3
    this.shh = new Shh('ws://eth.oja.me:8547');
    this.appName = Web3Utils.asciiToHex('hermes-network').slice(0, 10);
  }

  async initialize() {
    this.symKeyID = await this.shh.generateSymKeyFromPassword('hermes');
  }

  async send(data) {
    const payload = this.web3.utils.asciiToHex(JSON.stringify(data));

    const message = {
      symKeyID: this.symKeyID,
      ttl: 100,
      topic: this.appName,
      powTarget: 2.0,
      powTime: 2,
      payload: payload
    };

    const result = await this.shh.post(message);
    console.log(result);
    return result;
  }
}
