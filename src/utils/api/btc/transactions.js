import * as bitcoin from 'bitcoinjs-lib';
import * as popsicle from 'popsicle';
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
 * @param {Number} [netCode=1] Network code of mainnet or testnet. Defaults to testnet (1)
 */
const normalizeTransactionsResponse = ({
  address,
  list,
// eslint-disable-next-line max-statements
}, netCode = 1) => list.map((tx, feeSatoshi, confirmations, timestamp) => {
  const data = {
    id: tx.txid,
    timestamp: Number(timestamp) * 1000,
    confirmations,
    type: 0,
    data: '',
  };

  data.fee = feeSatoshi;

  const ownedInput = tx.inputs.find(i => i.txDetail.scriptPubKey.addresses.includes(address));

  if (ownedInput) {
    data.senderAddress = address;
    const extractedAddress = tx.outputs[0].scriptPubKey.addresses[0];
    data.recipientAddress = validateAddress(tokenMap.BTC.key, extractedAddress, netCode) === 0 ? extractedAddress : 'Unparsed Address';
    data.amount = tx.outputs[0].satoshi;
  } else {
    const output = tx.outputs.find(o => o.scriptPubKey.addresses.includes(address));
    const extractedAddress = tx.inputs[0].txDetail.scriptPubKey.addresses[0];
    data.senderAddress = validateAddress(tokenMap.BTC.key, extractedAddress, netCode) === 0 ? extractedAddress : 'Unparsed Address';
    data.recipientAddress = address;
    data.amount = output.satoshi;
  }

  return data;
});

export const get = ({
  id,
  address,
  limit = 50,
  offset = 0,
// eslint-disable-next-line max-statements
}, netCode = 1) => new Promise(async (resolve, reject) => {
  try {
    let response;
    const config = getBtcConfig(netCode);

    if (id) {
      response = await popsicle.get(`${config.url}/transaction/${id}`)
        .use(popsicle.plugins.parse('json'));
    } else {
      response = await popsicle.get(`${config.url}/transactions/${address}?limit=${limit}&offset=${offset}&sort=height:desc`)
        .use(popsicle.plugins.parse('json'));
    }

    const json = response.body;

    if (response) {
      const data = normalizeTransactionsResponse({
        address,
        list: id ? [json.data] : json.data,
      });


      resolve({
        data,
        meta: json.meta || {},
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
export const getUnspentTransactionOutputs = (address, netCode = 1) =>
  new Promise(async (resolve, reject) => {
    try {
      const config = getBtcConfig(netCode);
      const response = await popsicle.get(`${config.url}/utxo/${address}`)
        .use(popsicle.plugins.parse('json'));
      const json = response.body;

      if (response) {
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
}, netCode = 1) => new Promise(async (resolve, reject) => {
  try {
    amount = Number(amount);
    dynamicFeePerByte = Number(dynamicFeePerByte);

    const config = getBtcConfig(netCode);
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

export const broadcast = (transactionHex, netCode = 1) => new Promise(async (resolve, reject) => {
  try {
    const config = getBtcConfig(netCode);
    const body = JSON.stringify({ tx: transactionHex });

    const response = await popsicle.post(`${config.url}/transaction`, { body });

    if (response) {
      resolve(response.body);
    } else {
      reject(response.body);
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
export const getTransactionExplorerURL = (id, netCode = 1) => `${getBtcConfig(netCode).transactionExplorerURL}/${id}`;
