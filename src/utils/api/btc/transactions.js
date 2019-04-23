import bitcoin from 'bitcoinjs-lib';
import getBtcConfig from './config';
import { extractAddress, getDerivedPathFromPassphrase } from './account';
import { validateAddress } from '../../validators';
import { tokenMap } from '../../../constants/tokens';

/**
 * Normalizes transaction data retrieved from Blockchain.info API
 * @param {Object} data
 * @param {String} data.address Base address to use for formatting transactions
 * @param {Array} data.list Transaction list retrieved from API
 * @param {Number} data.blockHeight Latest block height for calculating confirmation count
 */
const normalizeTransactionsResponse = ({
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
  };

  const ownedInput = tx.inputs.find(i => i.txDetail.scriptPubKey.addresses.includes(address));

  if (ownedInput) {
    data.senderAddress = address;
    const extractedAddress = tx.outputs[0].scriptPubKey.addresses[0];
    data.recipientAddress = validateAddress(tokenMap.BTC.key, extractedAddress) === 0 ? extractedAddress : 'Unparsed Address';
    data.amount = tx.outputs[0].satoshi;
  } else {
    const output = tx.outputs.find(o => o.scriptPubKey.addresses.includes(address));
    const extractedAddress = tx.inputs[0].txDetail.scriptPubKey.addresses[0];
    data.senderAddress = validateAddress(tokenMap.BTC.key, extractedAddress) === 0 ? extractedAddress : 'Unparsed Address';
    data.recipientAddress = address;
    data.amount = output.satoshi;
  }

  return data;
});

export const get = ({
  id,
  address,
  limit = 20,
  offset = 0,
  // eslint-disable-next-line max-statements
}, netCode = 1) => new Promise(async (resolve, reject) => {
  try {
    let response;
    const config = getBtcConfig(netCode);

    if (id) {
      response = await fetch(`${config.url}/transaction/${id}`, config.requestOptions);
    } else {
      response = await fetch(`${config.url}/transactions/${address}?limit=${limit}&offset=${offset}&sort=height:desc`, config.requestOptions);
    }

    const json = await response.json();

    if (response.ok) {
      const data = normalizeTransactionsResponse({
        address,
        list: id ? [json.data] : json.data,
      });

      resolve({
        data,
        meta: json.meta ? { count: json.meta.total } : {},
      });
    } else {
      reject(json);
    }
  } catch (error) {
    reject(error);
  }
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
  recipientAddress,
  amount,
  dynamicFeePerByte,
  // eslint-disable-next-line max-statements
}) => new Promise(async (resolve, reject) => {
  try {
    amount = Number(amount);
    dynamicFeePerByte = Number(dynamicFeePerByte);

    const senderAddress = extractAddress(passphrase);
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

    const config = getBtcConfig(1); // TODO fix this to get config from redux
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
    const derivedPath = getDerivedPathFromPassphrase(passphrase);
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
      resolve(json);
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
