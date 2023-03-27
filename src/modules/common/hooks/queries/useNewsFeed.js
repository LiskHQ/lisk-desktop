import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { NEWSFEED } from 'src/const/queries';
import { useCustomInfiniteQuery } from '@common/hooks';

/**
 * Creates a custom hook for news feed queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {Object} configuration.config - the query config
 * @param {Object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {number} [configuration.config.params.source] - news feed source
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useNewsFeed = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/newsfeed`,
    method: 'get',
    event: 'get.newsfeed',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };
  return useCustomInfiniteQuery({
    keys: [NEWSFEED],
    config,
    options,
  });
};
