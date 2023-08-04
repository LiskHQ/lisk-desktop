import { POS_REWARDS_LOCKED } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from '@common/hooks';

/**
 * Creates a custom hook to fetch claimable rewards by address
 *
 * @returns the query object
 */

export const useRewardsLocked = ({ config: customConfig = {}, options } = {}) => {
  const hasRequiredParams =
    customConfig.params?.address || customConfig.params?.name || customConfig.params?.publicKey;

  const config = {
    url: `/api/${API_VERSION}/pos/rewards/locked`,
    method: 'get',
    event: 'get.pos.rewards.locked',
    ...customConfig,
  };

  return useCustomQuery({
    keys: [POS_REWARDS_LOCKED],
    config,
    options: {
      ...options,
      enabled: !!hasRequiredParams,
    },
  });
};
