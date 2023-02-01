/* istanbul ignore file */
import { STAKES_RECEIVED } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for stakes received queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} configuration.config.params.address - account address
 * @param {string} [configuration.config.params.name] - account name
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useReceivedStakes = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/pos/stakers`,
    method: 'get',
    event: 'get.pos.stakers',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };
  const customOptions = {
    ...options,
    select: (data) =>
      data.pages.reduce((prevPages, page) => {
        const newData = page?.data || {};
        const newStakers = page?.data.stakers || [];
        return {
          ...page,
          data: {
            ...newData,
            stakers: prevPages.data ? [...prevPages.data.stakers, ...newStakers] : newStakers,
          },
        };
      }),
  };

  return useCustomInfiniteQuery({
    keys: [STAKES_RECEIVED],
    options: customOptions,
    config,
  });
};
