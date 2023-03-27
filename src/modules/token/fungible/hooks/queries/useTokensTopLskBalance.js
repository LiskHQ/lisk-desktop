/* istanbul ignore file */
import { TOKENS_TOP_LSK_BALANCE } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for Token balance list queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.sort] - the query sort
 *
 * @returns the query object
 */

export const useTokensTopLskBalance = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/tokens/lsk/top`,
    method: 'get',
    event: 'get.tokens.lsk.top',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };
  return useCustomInfiniteQuery({
    keys: [TOKENS_TOP_LSK_BALANCE],
    config,
    options,
  });
};
