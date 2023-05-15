/* istanbul ignore file */
import { TOKENS_SUPPORTED } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';
import defaultClient from 'src/utils/api/client';

/**
 * Get an overview(escrowedAmounts, supportedTokens, totalSupply, etc..) of token specific to a network
 */

export const useTokenSummary = ({
  config: customConfig = {},
  options,
  client = defaultClient,
} = {}) => {
  const config = {
    url: `/api/${API_VERSION}/token/summary`,
    method: 'get',
    ...customConfig,
    event: 'get.token.summary',
    params: { ...(customConfig?.params || {}) },
  };

  return useCustomInfiniteQuery({
    keys: [TOKENS_SUPPORTED],
    config,
    options,
    client,
  });
};
