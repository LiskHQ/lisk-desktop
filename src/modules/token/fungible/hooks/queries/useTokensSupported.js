/* istanbul ignore file */
import { TOKENS_SUPPORTED } from 'src/const/queries';
import {
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import defaultClient from 'src/utils/api/client';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';
import { tokenTransformResult } from '@token/fungible/utils/tokenTransformResult';
import { useAppsMetaTokensConfig } from '@token/fungible/hooks/queries/useAppsMetaTokens';

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
// eslint-disable-next-line import/prefer-default-export
export const useTokensSupported = ({ config: customConfig = {}, options, client = defaultClient } = {}) => {
  const createMetaConfig = useAppsMetaTokensConfig();
  const transformResult = tokenTransformResult({createMetaConfig, client});
  const config = {
    url: `/api/${API_VERSION}/tokens/supported`,
    method: 'get',
    transformResult,
    ...customConfig,
    event: 'get.tokens.supported',
    params: { limit, ...(customConfig?.params || {}) },
  };

  return useCustomInfiniteQuery({
    keys: [TOKENS_SUPPORTED],
    config,
    options,
    client
  });
};
