/* eslint-disable max-lines */
import * as bitcoin from 'bitcoinjs-lib';
import { BigNumber } from 'bignumber.js';

import { validateAddress } from '../../validators';
import { tokenMap } from '../../../constants/tokens';
import { extractAddress, getDerivedPathFromPassphrase } from '../account';
import { fromRawLsk } from '../../lsk';
import { getNetworkConfig } from '../network';
import http from '../http';

const httpPrefix = '';

const httpPaths = {
  transactions: `${httpPrefix}/transactions`,
  transaction: `${httpPrefix}/transaction`,
};

/**
 * Normalizes transaction data retrieved from Blockchain.info API
 *
 * @param {Object} data
 * @param {String} data.address Base address to use for formatting transactions
 * @param {Array} data.list Transaction list retrieved from API
 * @param {Number} data.blockHeight Latest block height for calculating confirmation count
 */
const normalizeTransactionsResponse = ({
  network,
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
    title: 'transfer',
    data: '',
    fee: feeSatoshi,
    explorerLink: `${network.networks.BTC.transactionExplorerURL}/${tx.txid}`,
  };

  data.senderId = tx.inputs[0].txDetail.scriptPubKey.addresses[0];
  const extractedAddress = tx.outputs[0].scriptPubKey.addresses[0];
  data.recipientId = validateAddress(tokenMap.BTC.key, extractedAddress, network) === 0
    ? extractedAddress : 'Unparsed Address';
  data.amount = tx.outputs[0].satoshi.toString();

  return data;
});

/**
 * Retrieves the details of a single BTC transaction for a given id
 * Converts the response to match Lisk data structure
 *
 * @param {Object} data
 * @param {String} data.params
 * @param {String} data.params.id - Id of the transaction
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} Transaction details API call
 */
export const getTransaction = ({
  network,
  params,
}) => http({
  network,
  params: {},
  path: `${httpPaths.transaction}/${params.id}`,
  baseUrl: network.networks.BTC.serviceUrl,
}).then(response => ({
  meta: response.meta,
  data: normalizeTransactionsResponse({
    network,
    list: [response.data],
  }),
}));

const filters = {
  dateFrom: { key: 'from', test: timestamp => (new Date(timestamp)).getTime() > 0 },
  dateTo: { key: 'to', test: timestamp => (new Date(timestamp)).getTime() > 0 },
  amountFrom: { key: 'min', test: num => typeof num === 'number' && num >= 0 },
  amountTo: { key: 'max', test: num => typeof num === 'number' && num > 0 },
  limit: { key: 'limit', test: num => (typeof num === 'number' && num > 0) },
  offset: { key: 'offset', test: num => (typeof num === 'number' && num >= 0) },
  sort: {
    key: 'sort',
    test: str => ['amount:asc', 'amount:desc', 'fee:asc', 'fee:desc', 'type:asc', 'type:desc', 'timestamp:asc', 'timestamp:desc'].includes(str),
  },
};

/**
 * Retrieves the list of BTC transactions for a given parameters set
 * Converts the response to match Lisk data structure
 *
 * @param {Object} data
 * @param {Object} data.network - Network setting from Redux store
 * @param {Object} data.params
 * @param {String} data.params.address Sender or recipient account
 * @param {Number} data.params.offset Used for pagination
 * @param {Number} data.params.limit Used for pagination
 * @param {String} data.params.sort an option of 'amount:asc',
 * 'amount:desc', 'timestamp:asc', 'timestamp:desc',
 * @returns {Promise} Transactions list API call
 *
 * @todo normalize params id necessary
 */
export const getTransactions = ({
  network,
  params,
}) => {
  const normParams = {};

  // if blockId, ignore others
  if (params.blockId) {
    normParams.block = params.blockId;
  } else {
    // Validate params and fix keys
    Object.keys(params).forEach((key) => {
      if (filters[key] && filters[key].test(params[key])) {
        normParams[filters[key].key] = params[key];
      } else {
        // eslint-disable-next-line no-console
        console.log(`getTransactions: Dropped ${key} parameter, it's invalid.`);
      }
    });
  }

  return http({
    network,
    params: normParams,
    path: `${httpPaths.transactions}/${params.address}`,
    baseUrl: network.networks.BTC.serviceUrl,
  }).then(response => ({
    meta: response.meta,
    data: normalizeTransactionsResponse({
      network,
      list: response.data,
    }),
  }));
};

/**
 * Retrieves unspent tx outputs of a BTC address from Blockchain.info API
 * @param {String} address
 * @returns {Promise<Array>}
 */
export const getUnspentTransactionOutputs = (address, network) =>
  http({
    network,
    baseUrl: '', // @todo add real base url here...
    path: `utxo/${address}`,
    params: { limit: 100 },
  });

/**
 * Normalizes transaction data retrieved from Blockchain.info API
 * @param {Object} data
 * @param {Number} data.inputCount
 * @param {Number} data.outputCount
 * @param {Number} data.selectedFeePerByte - in satoshis/byte.
 */
export const calculateTransactionFee = ({
  inputCount,
  outputCount,
  selectedFeePerByte,
}) => ((inputCount * 180) + (outputCount * 34) + 10 + inputCount) * selectedFeePerByte;

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
  selectedFeePerByte, satoshiValue, unspentTransactionOutputs,
}) => {
  const feeInSatoshis = calculateTransactionFee({
    inputCount: getUnspentTransactionOutputCountToConsume(satoshiValue, unspentTransactionOutputs),
    outputCount: 2,
    selectedFeePerByte,
  });

  return calculateTransactionFee({
    inputCount: getUnspentTransactionOutputCountToConsume(satoshiValue
      + feeInSatoshis, unspentTransactionOutputs),
    outputCount: 2,
    selectedFeePerByte,
  });
};

/**
 * Returns a dictionary of base fees for low, medium and high processing speeds
 */
export const getTransactionBaseFees = async () => {
  const config = getNetworkConfig(tokenMap.LSK.key, { name: 'Mainnet' });
  const response = await http({
    baseUrl: config.minerFeesURL,
  });

  return response;
};

/**
 * Returns the actual tx fee based on given tx details and selected processing speed
 * @param {String} address - Account address
 * @param {Object} network - network configuration
 */
export const getTransactionFee = async ({
  account, network, txData, selectedPriority,
}) => {
  const unspentTransactionOutputs = await getUnspentTransactionOutputs(
    account.address, network,
  );

  const value = fromRawLsk(getTransactionFeeFromUnspentOutputs({
    unspentTransactionOutputs,
    satoshiValue: txData.amount || 0,
    selectedFeePerByte: selectedPriority.value,
  }));

  const feedback = txData.amount === 0
    ? '-'
    : `${(value ? '' : 'Invalid amount')}`;

  return {
    value,
    error: !!feedback,
    feedback,
  };
};

/**
 * create a new transaction
 * @param {string} passphrase - the sender passphrase
 * @param {string} recipientId - the recipient address
 * @param {string} amount - the transaction amount
 * @param {string} selectedFeePerByte - in satoshis/byte.
 * @param {Object} network - the network object
 */
export const create = ({
  passphrase,
  recipientId: recipientAddress,
  amount,
  selectedFeePerByte,
  network,
  // eslint-disable-next-line max-statements
}) => new Promise(async (resolve, reject) => {
  try {
    const config = getNetworkConfig(tokenMap.LSK.key, network);
    amount = Number(amount);
    selectedFeePerByte = Number(selectedFeePerByte);

    const senderAddress = extractAddress(passphrase, config);
    const unspentTxOuts = await getUnspentTransactionOutputs(senderAddress, network);

    // Estimate total cost (currently estimates max cost by assuming the worst case)
    const estimatedMinerFee = calculateTransactionFee({
      inputCount: unspentTxOuts.length,
      outputCount: 2,
      selectedFeePerByte,
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
      selectedFeePerByte,
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

export const broadcast = async (transaction, network) => {
  const config = getNetworkConfig(tokenMap.LSK.key, network);

  const response = await http({
    baseUrl: config.url,
    path: 'transactions',
    method: 'POST',
    ...config.requestOptions,
    body: JSON.stringify({ tx: transaction }),
  });

  return response;
};
