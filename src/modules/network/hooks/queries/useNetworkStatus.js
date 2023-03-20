import { NETWORK_STATUS } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for network status query
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query parameters
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useNetworkStatus = ({ config: customConfig = {}, options, client } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/network/status`,
    method: 'get',
    event: 'get.network.status',
    ...customConfig,
  };
  return useCustomQuery({
    keys: [NETWORK_STATUS],
    config,
    options,
    client,
  });
};
