import * as bitcoin from 'bitcoinjs-lib';
import { BigNumber } from 'bignumber.js';

import { extractAddress, getDerivedPathFromPassphrase } from './account';
import { getAPIClient, getNetworkCode } from './network';
import { tokenMap } from '../../../constants/tokens';
import { validateAddress } from '../../validators';
import getBtcConfig from './config';
import networks from '../../../constants/networks';

/**
 * Normalizes transaction data retrieved from Blockchain.info API
 * @param {Object} data
 * @param {String} data.address Base address to use for formatting transactions
 * @param {Array} data.list Transaction list retrieved from API
 * @param {Number} data.blockHeight Latest block height for calculating confirmation count
 */
const normalizeTransactionsResponse = ({
  networkConfig,
  address,
  list,
  // eslint-disable-next-line max-statements
}) => list.map(({
  tx, feeSatoshi, confirmations, timestamp,
}) => {
  const data = {
    id: tx.txid,
    timestamp: timestamp ? Number(timestamp) * 1000 : null,
    confirmations: confirmations || 0,
    type: 0,
    data: '',
    fee: feeSatoshi,
    explorerLink: `${getAPIClient(networkConfig).config.transactionExplorerURL}/${tx.txid}`,
  };

  const ownedInput = tx.inputs.find(i => i.txDetail.scriptPubKey.addresses.includes(address));
  const networkCode = getNetworkCode(networkConfig);
  address = address || tx.outputs.slice(-1).reduce((addr, o) => o.scriptPubKey.addresses[0], '');

  if (ownedInput) {
    data.senderId = address;
    const extractedAddress = tx.outputs[0].scriptPubKey.addresses[0];
    data.recipientId = validateAddress(tokenMap.BTC.key, extractedAddress, networkCode) === 0
      ? extractedAddress : 'Unparsed Address';
    data.amount = tx.outputs[0].satoshi;
  } else {
    const output = tx.outputs.find(o => o.scriptPubKey.addresses.includes(address));
    const extractedAddress = tx.inputs[0].txDetail.scriptPubKey.addresses[0];
    const recipientAddress = address;
    data.senderId = validateAddress(tokenMap.BTC.key, extractedAddress) === 0 ? extractedAddress : 'Unparsed Address';
    data.senderId = validateAddress(tokenMap.BTC.key, extractedAddress, networkCode) === 0
      ? extractedAddress : 'Unparsed Address';
    data.recipientId = validateAddress(tokenMap.BTC.key, recipientAddress, networkCode) === 0
      ? recipientAddress : 'Unparsed Address';
    data.amount = output.satoshi;
  }

  return data;
});

export const getTransactions = ({
  networkConfig,
  address,
  limit,
  offset,
}) => new Promise(async (resolve, reject) => {
  const meta = {
    limit: limit || 0,
    offset,
  };
  await getAPIClient(networkConfig).get(`transactions/${address}?limit=${limit}&offset=${offset}&sort=height:desc`)
    .then((response) => {
      resolve({
        data: normalizeTransactionsResponse({
          networkConfig,
          address,
          list: response.body.data,
        }),
        meta: response.body.meta ? { ...meta, count: response.body.meta.total } : meta,
      });
    }).catch(reject);
});

export const getSingleTransaction = ({
  networkConfig,
  id,
}) => new Promise(async (resolve, reject) => {
  await getAPIClient(networkConfig).get(`transaction/${id}`)
    .then((response) => {
      resolve({
        data: normalizeTransactionsResponse({
          networkConfig,
          list: [response.body.data],
        }),
      });
    }).catch(reject);
});

/**
 * Normalizes transaction data retrieved from Blockchain.info API
 * @param {Object} data
 * @param {Number} data.inputCount
 * @param {Number} data.outputCount
 * @param {Number} data.dynamicFeePerByte - in satoshis/byte.
 */
export const calculateTransactionFee = ({
  inputCount,
  outputCount,
  dynamicFeePerByte,
}) => ((inputCount * 180) + (outputCount * 34) + 10 + inputCount) * dynamicFeePerByte;

/**
 * Retrieves unspent tx outputs of a BTC address from Blockchain.info API
 * @param {String} address
 * @returns {Promise<Array>}
 */
export const getUnspentTransactionOutputs = (address, networkConfig) =>
  new Promise(async (resolve, reject) => {
    getAPIClient(networkConfig).get(`utxo/${address}?limit=100`)
      .then((response) => {
        resolve(response.body.data);
      })
      .catch(reject);
  });

export const create = ({
  passphrase,
  recipientId: recipientAddress,
  amount,
  dynamicFeePerByte,
  network,
  // eslint-disable-next-line max-statements
}) => new Promise(async (resolve, reject) => {
  try {
    const config = getBtcConfig(network.name === networks.mainnet.name
      ? networks.mainnet.code
      : networks.testnet.code);
    amount = Number(amount);
    dynamicFeePerByte = Number(dynamicFeePerByte);

    const senderAddress = extractAddress(passphrase, config);
    const unspentTxOuts = await getUnspentTransactionOutputs(senderAddress, network);

    // Estimate total cost (currently estimates max cost by assuming the worst case)
    const estimatedMinerFee = calculateTransactionFee({
      inputCount: unspentTxOuts.length,
      outputCount: 2,
      dynamicFeePerByte,
    });

    const estimatedTotal = amount + estimatedMinerFee;

    // Check if balance is sufficient
    const unspentTxOutsTotal = unspentTxOuts.reduce((total, tx) => {
      total += tx.value;
      return total;
    }, 0);

    if (unspentTxOutsTotal < estimatedTotal) {
      reject(new Error('Insufficient (estimated) balance'));
    }

    // Find unspent txOuts to spend for this tx
    let txOutIndex = 0;
    let sumOfConsumedOutputs = 0;
    const txOutsToConsume = [];

    while (sumOfConsumedOutputs < estimatedTotal) {
      const tx = unspentTxOuts[txOutIndex];
      txOutsToConsume.push(tx);
      txOutIndex += 1;
      sumOfConsumedOutputs += tx.value;
    }

    const txb = new bitcoin.TransactionBuilder(config.network);

    // Add inputs from unspent txOuts
    // eslint-disable-next-line
    for (const tx of txOutsToConsume) {
      txb.addInput(tx.tx_hash, tx.tx_pos);
    }

    // Output to Recipient
    txb.addOutput(recipientAddress, amount);

    // Calculate final fee
    const calculatedMinerFee = calculateTransactionFee({
      inputCount: txOutsToConsume.length,
      outputCount: 2,
      dynamicFeePerByte,
    });

    // Calculate total
    const calculatedTotal = amount + calculatedMinerFee;

    // Output to Change Address
    const change = sumOfConsumedOutputs - calculatedTotal;
    txb.addOutput(senderAddress, change);

    // Sign inputs
    const derivedPath = getDerivedPathFromPassphrase(passphrase, config);
    const keyPair = bitcoin.ECPair.fromWIF(derivedPath.toWIF(), config.network);
    for (let i = 0; i < txOutsToConsume.length; i++) {
      txb.sign(i, keyPair);
    }

    resolve(txb.build().toHex());
  } catch (error) {
    reject(error);
  }
});

const getUnspentTransactionOutputCountToConsume = (satoshiValue, unspentTransactionOutputs) => {
  const amount = new BigNumber(satoshiValue);
  const [count] = unspentTransactionOutputs.reduce((result, output) => {
    if (amount.isGreaterThan(result[1])) {
      result[0] += 1;
      result[1] = result[1].plus(output.value);
    }

    return result;
  }, [0, new BigNumber(0)]);

  return count;
};

export const getTransactionFeeFromUnspentOutputs = ({
  dynamicFeePerByte, satoshiValue, unspentTransactionOutputs,
}) => {
  const feeInSatoshis = calculateTransactionFee({
    inputCount: getUnspentTransactionOutputCountToConsume(satoshiValue, unspentTransactionOutputs),
    outputCount: 2,
    dynamicFeePerByte,
  });

  return calculateTransactionFee({
    inputCount: getUnspentTransactionOutputCountToConsume(satoshiValue
      + feeInSatoshis, unspentTransactionOutputs),
    outputCount: 2,
    dynamicFeePerByte,
  });
};

export const broadcast = (transactionHex, network) => new Promise(async (resolve, reject) => {
  try {
    const config = getBtcConfig(network.name === networks.mainnet.name
      ? networks.mainnet.code
      : networks.testnet.code);
    const response = await fetch(`${config.url}/transaction`, {
      ...config.requestOptions,
      method: 'POST',
      body: JSON.stringify({ tx: transactionHex }),
    });

    const json = await response.json();

    if (response.ok) {
      resolve(json.data);
    } else {
      reject(json);
    }
  } catch (error) {
    reject(error);
  }
});
