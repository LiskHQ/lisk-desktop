import { REWARD_INFLATION } from 'src/const/queries';
import {
  API_VERSION,
} from 'src/const/config';
import { useCustomQuery } from '@common/hooks';

/**
 * Creates a custom hook to fetch the current inflation rate in the total supply because of the token being rewarded (block generation)/ burnt (transaction minFee & extraFees).
 *
 * @param {object} [configuration] - the custom query configuration object
 * @param {object} [configuration.config] - the query config
 * @param {string} [configuration.options] - the query options
 *
 * @returns the query object
 */

export const useRewardInflation = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/reward/inflation`,
    method: 'get',
    event: 'get.reward.inflation',
    ...customConfig,
  };

  return useCustomQuery({
    keys: [REWARD_INFLATION],
    config,
    options,
  });
};
