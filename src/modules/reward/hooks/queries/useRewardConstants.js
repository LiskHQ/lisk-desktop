import { REWARD_CONSTANTS } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from '@common/hooks';

export const useRewardConstants = ({ config: customConfig = {}, options } = {}) => {
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
