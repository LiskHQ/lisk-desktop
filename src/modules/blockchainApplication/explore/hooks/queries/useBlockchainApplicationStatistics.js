import { BLOCKCHAIN_APPS_STATICS } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for blockchain applications meta queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */
// eslint-disable-next-line import/prefer-default-export
export const useBlockchainApplicationStatistics = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/blockchain/apps/statistics`,
    method: 'get',
    event: 'get.blockchain.apps.statistics',
    ...customConfig,
  };
  return useCustomQuery({
    keys: [BLOCKCHAIN_APPS_STATICS],
    config,
    options,
  });
};
