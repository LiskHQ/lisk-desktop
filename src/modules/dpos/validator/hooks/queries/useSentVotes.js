/* istanbul ignore file */
import { VOTES_SENT } from 'src/const/queries';
import {
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for votes sent queries
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
export const useSentVotes = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/dpos/votes/sent`,
    method: 'get',
    event: 'get.dpos.votes.sent',
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
  };
  return useCustomInfiniteQuery({
    keys: [VOTES_SENT],
    options: customOptions,
    config,
  });
};
