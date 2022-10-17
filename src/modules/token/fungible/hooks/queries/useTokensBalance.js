/* istanbul ignore file */
import { TOKENS_BALANCE } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';
import { useCurrentAccount } from '@account/hooks';
import { useAppsMetaTokensConfig } from '@token/fungible/hooks/queries/useAppsMetaTokens';
import defaultClient from 'src/utils/api/client';
import { tokenTransformResult } from '@token/fungible/utils/tokenTransformResult';

/**
 * Creates a custom hook for Token balance list queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {string} configuration.config.params.address - get balance information by address
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.tokenID] - get balance information by tokenID
 *
 * @returns the query object
 */

export const useTokensBalance = ({
  config: customConfig = {},
  options,
  client = defaultClient,
} = {}) => {
  const [currentAccount] = useCurrentAccount();
  const { address } = currentAccount.metadata;
  const createMetaConfig = useAppsMetaTokensConfig();
  const transformResult = tokenTransformResult({createMetaConfig, client});

  const config = {
    url: `/api/${API_VERSION}/tokens`,
    method: 'get',
    event: 'get.tokens',
    transformResult,
    ...customConfig,
    params: { limit, address, ...(customConfig?.params || {}) },
  };

  return useCustomInfiniteQuery({
    keys: [TOKENS_BALANCE],
    config,
    options,
    client,
  });
};
