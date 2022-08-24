import { useQuery } from '@tanstack/react-query';
import { BLOCKCHAIN_APPS_STATICS } from 'src/const/queries';
import {
  METHOD,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

/**
 * Creates a custom hook for blockchain applications list queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */
// eslint-disable-next-line import/prefer-default-export
export const useBlockchainApplicationStatistics = ({
  config: customConfig = {},
  options,
} = {}) => {
  const config = {
    url: `/api/${API_VERSION}/blockchain/apps/statistics`,
    method: 'get',
    event: 'get.blockchain.apps.statistics',
    ...customConfig,
  };
  return useQuery(
    [BLOCKCHAIN_APPS_STATICS, METHOD, config],
    async () => API_METHOD[METHOD](config),
    {
      ...options,
    },
  );
};
