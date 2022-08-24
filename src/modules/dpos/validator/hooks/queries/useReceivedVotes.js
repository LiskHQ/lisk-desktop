/* istanbul ignore file */
import { VOTES_RECEIVED, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks/queries';

/**
 * Creates a custom hook for votes received queries
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
// eslint-disable-next-line import/prefer-default-export
export const useReceivedVotes = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/dpos/votes/received`,
    method: 'get',
    event: 'get.dpos.votes.received',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };
  const customOptions = {
    ...options,
    select: (data) => data.pages.reduce((prevPages, page) => {
      const newData = page?.data || {};
      const newVotes = page?.data.votes || [];
      return {
        ...page,
        data: {
          ...newData,
          votes: prevPages.data ? [...prevPages.data.votes, ...newVotes] : newVotes,
        },
      };
    }),
    getNextPageParam: (lastPage) => {
      const offset = lastPage.meta.count + lastPage.meta.offset;
      const hasMore = offset < lastPage.meta.total;
      return !hasMore ? undefined : { offset };
    },
  };
  const keys = [VOTES_RECEIVED, APPLICATION, METHOD, config];

  return useCustomInfiniteQuery({
    keys,
    options: customOptions,
    config,
  });
};
