import { regex, tokenMap } from '@constants';
import { validateAddress } from '@utils/validators';
import { getAccount } from '../account/lsk';
import { getTransaction } from '../transaction/lsk';
import { getDelegates } from '../delegate';
import { getBlock } from '../block';

/**
 * Fetches transaction or block info for a given id
 * Since tx and block ids have a similar pattern, they
 * are not distinguishable using regex. We need to make
 * 2 API calls and return the discovered result.
 *
 * @param {Object} data
 * @param {Object} data.network - Network config from the Redux store
 * @param {Object} data.params
 * @param {String} data.params.query - Search query
 * @param {String} data.baseUrl - custom BaseUrl used for fetching archived data
 * @returns {Object} An object containing arrays of transactions and blocks
 */
// eslint-disable-next-line max-statements
const getTransactionOrBlock = async ({ network, params, baseUrl }) => {
  let transactions = [];
  let blocks = [];
  let addresses = [];
  try {
    const res = await getTransaction({
      network,
      params: { transactionId: params.query },
      baseUrl,
    });
    transactions = res.data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`There is no transaction with the given id: ${params.query}`);
  }
  try {
    const res = await getBlock({
      network,
      params: { blockId: params.query },
      baseUrl,
    });
    blocks = res.data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`There is no block with the given id: ${params.query}`);
  }

  try {
    const res = await getAccount({
      network,
      params: { publicKey: params.query },
      baseUrl,
    });
    if (res.summary?.balance > 0) {
      addresses = [res];
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(`There is no account with the given public key: ${params.query}`);
  }

  return ({
    data: {
      transactions,
      blocks,
      addresses,
    },
    meta: transactions.length || blocks.length || addresses.length,
  });
};

/**
 * Defines the entity corresponding the given query
 * and uses other API methods to fetch the data
 *
 * @param {Object} data
 * @param {Object} data.network - Network config from the Redux store
 * @param {Object} data.params
 * @param {String} data.params.query - Search query
 * @param {String} data.baseUrl - custom BaseUrl used for fetching archived data
 * @returns {Promise}
 */
// eslint-disable-next-line import/prefer-default-export
export const search = ({ network, params, baseUrl }) => {
  if (validateAddress(tokenMap.LSK.key, params.query) === 0) {
    return getAccount({
      network,
      params: { address: params.query },
      baseUrl,
    }).then(res => ({ data: { addresses: [res] }, meta: res.meta }));
  }
  if (regex.transactionId.test(params.query)) {
    return getTransactionOrBlock({ network, params, baseUrl });
  }
  if (regex.blockHeight.test(params.query)) {
    return getBlock({
      network,
      params: { height: params.query },
      baseUrl,
    }).then(res => ({ data: { blocks: res.data }, meta: res.meta }));
  }
  return getDelegates({
    network,
    params: { search: params.query, limit: 4 },
    baseUrl,
  }).then(res => ({ data: { delegates: res.data }, meta: res.meta }));
};
