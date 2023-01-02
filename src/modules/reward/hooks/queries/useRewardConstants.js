import { REWARD_CONSTANTS } from 'src/const/queries';
import {
  API_VERSION,
} from 'src/const/config';
import { useCustomQuery } from '@common/hooks';

/**
 * Creates a custom hook to fetch reward constants
 *
 * @param {object} [configuration] - the custom query configuration object
 * @param {object} [configuration.config] - the query config
 * @param {string} [configuration.options] - the query options
 *
 * @returns the query object
 */

export const useRewardConstants = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/reward/constants`,
    method: 'get',
    event: 'get.reward.constants',
    ...customConfig,
  };

  return useCustomQuery({
    keys: [REWARD_CONSTANTS],
    config,
    options: {
      cacheTime: Infinity,
      staleTime: Infinity,
      ...options,
    },
  });
};
