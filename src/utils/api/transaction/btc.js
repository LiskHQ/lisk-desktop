// import bitcoin from 'bitcoinjs-lib';
import { getNetworkCode, getNetworkConfig } from '../network';
import { validateAddress } from '../../validators';
import { tokenMap } from '../../../constants/tokens';
import http from '../http';

/**
 * Normalizes transaction data retrieved from Blockchain.info API
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
    data: '',
    fee: feeSatoshi,
    explorerLink: `${getNetworkConfig(network).transactionExplorerURL}/${tx.txid}`,
  };

  const networkCode = getNetworkCode(network);
  data.senderId = tx.inputs[0].txDetail.scriptPubKey.addresses[0];
  const extractedAddress = tx.outputs[0].scriptPubKey.addresses[0];
  data.recipientId = validateAddress(tokenMap.BTC.key, extractedAddress, networkCode) === 0
    ? extractedAddress : 'Unparsed Address';
  data.amount = tx.outputs[0].satoshi.toString();

  return data;
});

/**
 * Retrieves the details of a single BTC transaction for a given id
 * Converts the response to match Lisk data structure
 *
 * @param {Object} data
 * @param {String} data.params - Id of the transaction
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Promise} Transaction details API call
 */
export const getTransaction = ({
  network,
  id,
}) => http({
  network,
  params: { id },
}).then(response => normalizeTransactionsResponse({
  network,
  list: [response.body.data],
}));

/**
 * Retrieves the list of BTC transactions for a given parameters set
 * Converts the response to match Lisk data structure
 *
 * @param {Object} data
 * @param {Object} data.network - Network setting from Redux store
 * @param {Object} data.params
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
}) => http({
  network,
  params,
}).then(response => normalizeTransactionsResponse({
  network,
  list: [response.body.data],
}));
