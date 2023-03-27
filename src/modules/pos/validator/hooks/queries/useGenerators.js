import { GENERATOR } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for block generator queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.sort] - the query sort
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useGenerators = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/generators`,
    method: 'get',
    event: 'get.generators',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };
  return useCustomInfiniteQuery({
    keys: [GENERATOR],
    config,
    options,
  });
};
