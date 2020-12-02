import http from '../http';

/**
 * Retrieves the details of a single transaction
 *
 * @param {Object} data
 * @param {String} data.params - Id of the transaction
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Object} Transaction details
 */
export const getTransaction = data => http({
  path: 'transactions',
  params: { id: data.id },
  network: data.network,
  baseUrl: data.baseUrl,
});

export const getTransactions = data => new Promise(resolve =>
  resolve({ endpoint: 'getTransactions', token: 'LSK', data }));

export const getRegisteredDelegates = data => new Promise(resolve =>
  resolve({ endpoint: 'getRegisteredDelegates', token: 'LSK', data }));

/**
 * Retrieves the overall statistics of network transactions.
 *
 * @param {Object} data
 * @param {Object} data.params
 * @param {String} data.params.period - An option of 'day' or 'month'
 * @param {Number} data.params.limit - The number of results
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Object} Network transactions statistics
 */
export const getTransactionStats = data => http({
  path: `transactions/statistics/${data.params.period}`,
  params: { limit: data.params.limit },
  network: data.network,
});
