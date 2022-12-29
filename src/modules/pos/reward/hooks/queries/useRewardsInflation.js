import { POS_REWARDS_INFLATION } from 'src/const/queries';
import {
  API_VERSION,
} from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook to fetch the current inflation rate in the total supply because of the token being rewarded (block generation)/ burnt (transaction minFee & extraFees).
 *
 * @param {object} [configuration] - the custom query configuration object
 * @param {object} [configuration.config] - the query config
 * @param {string} [configuration.options] - the query options
 *
 * @returns the query object
 */

export const useRewardsInflation = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/pos/rewards/inflation`,
    method: 'get',
    event: 'get.pos.rewards.inflation',
    ...customConfig,
  };

  return useCustomQuery({
    keys: [POS_REWARDS_INFLATION],
    config,
    options,
  });
};
