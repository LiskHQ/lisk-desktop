import http from '../http';

/**
 * Retrieves the details of a single transaction
 *
 * @param {Object} data
 * @param {String} data.params - Id of the transaction
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param
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

export const getTransactionStats = data => new Promise(resolve =>
  resolve({ endpoint: 'getTransactionStats', token: 'LSK', data }));
