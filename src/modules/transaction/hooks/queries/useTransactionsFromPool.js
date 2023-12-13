import { useInvokeQuery } from 'src/modules/common/hooks';

export const useTransactionsFromPool = ({ options = {}, customConfig = {} } = {}) => {
  const { params = {}, ...rest } = customConfig;

  const config = {
    data: {
      endpoint: 'txpool_getTransactionsFromPool',
      params,
    },
    ...rest,
  };

  const result = useInvokeQuery({
    config,
    options: { ...options, enabled: options?.enabled !== false },
  });

  return result;
};
