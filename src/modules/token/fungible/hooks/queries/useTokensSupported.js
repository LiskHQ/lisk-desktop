/* istanbul ignore file */
import { TOKENS_TOP_LSK_BALANCE, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks/queries';

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
export const useTokensSupported = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/tokens/lsk/top`,
    method: 'get',
    event: 'get.tokens.supported',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };
  const keys = [TOKENS_TOP_LSK_BALANCE, APPLICATION, METHOD, config];
  return useCustomInfiniteQuery({ config, options, keys });
};
