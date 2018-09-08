import Web3 from 'web3';
import ethUtils from 'ethereumjs-util';
import abi from 'ethereumjs-abi';

export function createMsgHash(
  to,
  value,
  data,
  operation,
  safeTxGas,
  dataGas,
  gasPrice,
  gasToken,
  refundReceiver,
  nonce,
  SAFE_TX_TYPEHASH = '0x14d461bc7412367e924637b363c7bf29b8f47e2f84869f4426e5633d8af47b20'
) {
  const dataHash = Web3.utils.soliditySha3({
    t: 'bytes',
    v: data
  });

  console.log(data.length);
  console.log(dataHash);

  return Web3.utils.soliditySha3(
    { t: 'bytes32', v: SAFE_TX_TYPEHASH },
    { t: 'address', v: to },
    { t: 'uint256', v: value },
    { t: 'bytes32', v: dataHash },
    { t: 'uint256', v: operation },
    { t: 'uint256', v: safeTxGas },
    { t: 'uint256', v: gasPrice },
    { t: 'address', v: gasToken },
    { t: 'address', v: refundReceiver },
    { t: 'uint256', v: nonce }
  );
}
