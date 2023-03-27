import { NETWORK_STATISTICS } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks/useCustomQuery';

/**
 * Creates a custom hook for network statistics query
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query parameters
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useNetworkStatistics = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/network/statistics`,
    method: 'get',
    event: 'get.network.statistics​',
    ...customConfig,
  };
  return useCustomQuery({
    keys: [NETWORK_STATISTICS],
    config,
    options,
  });
};
