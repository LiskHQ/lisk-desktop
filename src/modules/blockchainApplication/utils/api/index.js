import http from '@common/utilities/api/http';
import { HTTP_PREFIX } from 'src/const/httpCodes';

const httpPaths = {
  networkStatus: `${HTTP_PREFIX}/blockchain/apps`,
  networkStatistics: `${HTTP_PREFIX}/blockchain/apps/statistics`,
};

/**
 * Retrieves sidechains applications information
 *
 * @param {Object} data
 * @param {Object} data.network The network config from the Redux store
 *
 * @returns {Promise}
 */
export const getApps = () => Promise.resolve([
  { status: 'registered' }, { status: 'registered' }, { status: 'active' }, { status: 'terminated' },
]);

/**
 * Retrieves sidechains statistics information
 *
 * @param {Object} data
 * @param {Object} data.network The network config from the Redux store
 *
 * @returns {Promise}
 */
export const getStatistics = () => Promise.resolve({
  totalSupplyLSK: 5e13,
  stakedLSK: 3e13,
});
