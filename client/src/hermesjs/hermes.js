import Web3 from 'web3';

import Publisher from './publisher';
import { createMsgHash, createSignedMsg } from './msgOperations';

const SAFE_TX_TYPEHASH = '0x14d461bc7412367e924637b363c7bf29b8f47e2f84869f4426e5633d8af47b20';

export class HermesJS {
  constructor(provider) {
    this.web3 = new Web3(provider);
    this.publisher = new Publisher(this.web3);
  }

  async initialize(publisher) {
    await this.publisher.initialize();
  }

  setSafeAddress(_safeAddress) {
    this.safeAddress = _safeAddress;
  }

  async sendMessage(
    to,
    value,
    data,
    operation = 0,
    safeTxGas = 0,
    dataGas = 0,
    gasPrice = 0,
    gasToken = '0x0000000000000000000000000000000000000000',
    refundReceiver = '0x0000000000000000000000000000000000000000',
    nonce = 0
  ) {
    let msgHash = createMsgHash(
      to,
      value,
      data,
      operation,
      safeTxGas,
      dataGas,
      gasPrice,
      gasToken,
      refundReceiver,
      nonce
    );

    let account = (await this.web3.eth.getAccounts())[0]
    let signedMessage = await this.web3.eth.personal.sign(msgHash, account);

    let toSend = {
      SAFE_TX_TYPEHASH: SAFE_TX_TYPEHASH,
      to: to,
      value: value,
      data: data,
      operation: operation,
      safeTxGas: safeTxGas,
      gasPrice: gasPrice,
      gasToken: gasToken,
      refundReceiver: refundReceiver,
      nonce: nonce,
      safeAddress: this.safeAddress,
      signedMessage: signedMessage
    };

    await this.publisher.send(toSend);
  }
}
