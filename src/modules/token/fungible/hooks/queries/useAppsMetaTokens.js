/* istanbul ignore file */
import { BLOCKCHAIN_APPS_META_TOKENS } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import defaultClient from 'src/utils/api/client';

/**
 * Creates a custom hook for supported tokens query
 *
 * @returns the query object
 */
export const useAppsMetaTokensConfig = () => {
  const [{ chainID }] = useCurrentApplication();

  return (customConfig = {}) => ({
    url: `/api/${API_VERSION}/blockchain/apps/meta/tokens`,
    method: 'get',
    event: 'get.blockchain.apps.meta.tokens',
    ...customConfig,
    params: { limit, chainID, ...(customConfig?.params || {}) },
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
