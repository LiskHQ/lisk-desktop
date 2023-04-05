/* istanbul ignore file */
import { TOKENS_SUPPORTED } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';
import defaultClient from 'src/utils/api/client';

/**
 * Creates a custom hook for supported tokens query
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 *
 * @returns the query object
 */

export const useTokensSupported = ({
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
