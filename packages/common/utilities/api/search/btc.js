import { regex } from '@common/configuration';
import { getTransaction } from '@transaction/utilities/api/btc';
import { getAccount } from '@wallet/utilities/api/btc';

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
export const search = ({ network, params }) => {
  if (regex.btcAddress.test(params.query)) {
    return getAccount({
      network,
      params: { address: params.query },
    }).then(res => ({ data: { addresses: [res] }, meta: res.meta }));
  }
  if (regex.btcTransactionId.test(params.query)) {
    return getTransaction({
      network,
      params: { id: params.query },
    }).then(res => ({ data: { transactions: res.data }, meta: res.meta }));
  }
  return () => new Promise((_, reject) =>
    reject(Error('Nothing found.')));
};
