import { REWARD_DEFAULT } from 'src/const/queries';
import {
  API_VERSION,
} from 'src/const/config';
import {  useCustomQuery } from '@common/hooks';

/**
 * Creates a custom hook for reward height queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.height] - the query height
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useRewardHeight = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/reward/default`,
    method: 'get',
    event: 'get.reward.default',
    ...customConfig,
  };
  return useCustomQuery({
    keys: [REWARD_DEFAULT],
    config,
    options,
  });
};
