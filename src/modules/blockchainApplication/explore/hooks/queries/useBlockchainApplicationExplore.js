import { BLOCKCHAIN_APPS } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for blockchain applications list queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.chainID] - application chain ID
 * @param {string} [configuration.config.params.name] - application name
 * @param {string} [configuration.config.params.search] - application search string
 * @param {string} [configuration.config.params.status] - application status
 * @param {string} [configuration.config.params.isDefault] - default applications filter
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useBlockchainApplicationExplore = ({
  config: customConfig = {},
  options,
  client,
} = {}) => {
  const config = {
    url: `/api/${API_VERSION}/blockchain/apps`,
    method: 'get',
    event: 'get.blockchain.apps',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };

  return useCustomInfiniteQuery({
    config,
    options,
    client,
    keys: [BLOCKCHAIN_APPS],
  });
};
