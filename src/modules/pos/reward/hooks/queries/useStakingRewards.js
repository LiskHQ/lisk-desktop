import { useInvokeQuery } from '@common/hooks';

export const useExpectedValidatorRewards = ({ options = {}, config: customConfig = {} } = {}) => {
  const config = {
    data: {
      endpoint: 'dynamicReward_getExpectedValidatorRewards',
      params: {
        ...customConfig.params,
      },
    },
  };

  const result = useInvokeQuery({
    config,
    options: { ...options },
  });

  return result;
};

export const usePosExpectedSharedRewards = (
  { options = {}, config: customConfig = {} } = {},
  isMonthly
) => {
  const { data: expectedValidatorRewards } = useExpectedValidatorRewards({
    options,
    config: { ...customConfig },
  });
  const validatorReward = isMonthly
    ? expectedValidatorRewards?.data?.monthlyReward
    : expectedValidatorRewards?.data?.yearlyReward;

  const config = {
    data: {
      endpoint: 'pos_getExpectedSharedRewards',
      params: {
        ...customConfig.params,
        validatorReward,
      },
    },
  };

  const result = useInvokeQuery({
    config,
    options: {
      ...options,
      enabled: options.enabled && !!validatorReward,
    },
  });
  console.log({ config, result }, '....resss');

  return result;
};
