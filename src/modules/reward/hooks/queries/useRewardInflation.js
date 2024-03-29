import { REWARD_INFLATION } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from '@common/hooks';

/**
 * Creates a custom hook to fetch the current inflation rate in the total supply because of the token being rewarded (block generation)/ burnt (transaction minFee & extraFees).
 */

export const useRewardInflation = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/reward/annual-inflation`,
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
