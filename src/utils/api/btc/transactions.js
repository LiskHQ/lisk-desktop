import * as bitcoin from 'bitcoinjs-lib';
import getBtcConfig from './config';
import { extractAddress, getDerivedPathFromPassphrase } from './account';
import { validateAddress } from '../../validators';
import { tokenMap } from '../../../constants/tokens';
import { getAPIClient } from './network';

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

  if (ownedInput) {
    data.senderId = address;
    const extractedAddress = tx.outputs[0].scriptPubKey.addresses[0];
    data.recipientId = validateAddress(tokenMap.BTC.key, extractedAddress) === 0 ? extractedAddress : 'Unparsed Address';
    data.amount = tx.outputs[0].satoshi;
  } else {
    address = address || tx.inputs[0].txDetail.scriptPubKey.addresses[0];
    const output = tx.outputs.find(o => o.scriptPubKey.addresses.includes(address));
    const extractedAddress = tx.inputs[0].txDetail.scriptPubKey.addresses[0];
    const recipientAddress = tx.outputs[0].scriptPubKey.addresses[0];
    data.senderId = validateAddress(tokenMap.BTC.key, extractedAddress) === 0 ? extractedAddress : 'Unparsed Address';
    data.recipientId = validateAddress(tokenMap.BTC.key, recipientAddress) === 0 ? recipientAddress : 'Unparsed Address';
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
  await getAPIClient(networkConfig).get(`transactions/${address}?limit=${limit}&offset=${offset}&sort=height:desc`)
    .then((response) => {
      resolve({
        data: normalizeTransactionsResponse({
          networkConfig,
          address,
          list: response.body.data,
        }),
        meta: response.body.meta ? { count: response.body.meta.total } : {},
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
export const getUnspentTransactionOutputs = address => new Promise(async (resolve, reject) => {
  try {
    const config = getBtcConfig(1); // TODO fix this to get config from redux
    const response = await fetch(`${config.url}/utxo/${address}`);
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

export const create = ({
  passphrase,
  recipientId: recipientAddress,
  amount,
  dynamicFeePerByte,
  // eslint-disable-next-line max-statements
}) => new Promise(async (resolve, reject) => {
  try {
    const config = getBtcConfig(1); // TODO fix this to get config from redux
    amount = Number(amount);
    dynamicFeePerByte = Number(dynamicFeePerByte);

    const senderAddress = extractAddress(passphrase, config);
    const unspentTxOuts = await exports.getUnspentTransactionOutputs(senderAddress);

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

    while (sumOfConsumedOutputs <= estimatedTotal) {
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

export const broadcast = transactionHex => new Promise(async (resolve, reject) => {
  try {
    const config = getBtcConfig(1); // TODO fix this to get config from redux
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

/**
 * Generates a Transaction Explorer URL for given transaction id
 * based on the configured network type
 * @param {String} - Transaction ID
 * @returns {String} - URL
 */
export const getTransactionExplorerURL = (id) => {
  const config = getBtcConfig(1); // TODO fix this to get config from redux
  return `${config.transactionExplorerURL}/${id}`;
};
