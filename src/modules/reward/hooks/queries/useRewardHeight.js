import { REWARD_DEFAULT } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from '@common/hooks';

export const useRewardHeight = ({ config: customConfig = {}, options } = {}) => {
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
