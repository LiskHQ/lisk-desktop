import { BLOCKCHAIN_APPS_META } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import defaultClient from 'src/utils/api/client';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';
// import useSettings from 'src/modules/settings/hooks/useSettings';

/**
 * Creates a custom hook for blockchain applications meta queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.chainID] - application chain ID
 * @param {string} [configuration.config.params.chainName] - application name
 * @param {string} [configuration.config.params.network] - network name
 * @param {string} [configuration.config.params.search] - application search string
 * @param {string} [configuration.config.params.sort] - the query sort
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useBlockchainApplicationMeta = ({
  config: customConfig = {},
  options,
  client = defaultClient,
} = {}) => {
  // const { mainChainNetwork } = useSettings('mainChainNetwork');
  // const network = mainChainNetwork?.name;

  const config = {
    url: `/api/${API_VERSION}/blockchain/apps/meta`,
    method: 'get',
    ...customConfig,
    event: 'get.blockchain.apps.meta',
    params: {
      limit,
      // network,
      ...(customConfig?.params || {}),
    },
  };

  return useCustomInfiniteQuery({
    keys: [BLOCKCHAIN_APPS_META],
    config,
    client,
    options,
  });
};
