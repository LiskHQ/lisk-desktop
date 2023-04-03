/* istanbul ignore file */
import { useSelector } from 'react-redux';
import { BLOCKCHAIN_APPS_META_TOKENS } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';
import { getNetworkName } from '@network/utils/getNetwork';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import defaultClient from 'src/utils/api/client';

/**
 * Creates a custom hook for supported tokens query
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 *
 * @returns the query object
 */
export const useAppsMetaTokensConfig = () => {
  const selectedNetwork = useSelector((state) => state.network);
  const network = getNetworkName(selectedNetwork);
  const [{ chainID }] = useCurrentApplication();
  return (customConfig = {}) => ({
    url: `/api/${API_VERSION}/blockchain/apps/meta/tokens`,
    method: 'get',
    event: 'get.blockchain.apps.meta.tokens',
    ...customConfig,
    // TODO: Remove hardcoded network
    params: { limit, network: 'devnet' || network, chainID, ...(customConfig?.params || {}) },
  });
};

export const useAppsMetaTokens = ({
  config: customConfig = {},
  options,
  client = defaultClient,
} = {}) => {
  const config = useAppsMetaTokensConfig()(customConfig);
  return useCustomInfiniteQuery({
    keys: [BLOCKCHAIN_APPS_META_TOKENS],
    config,
    client,
    options: {
      cacheTime: Infinity,
      ...options,
    },
  });
};
