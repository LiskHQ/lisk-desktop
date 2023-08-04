import { useInvokeQuery } from 'src/modules/common/hooks';

export const useTransactionsFromPool = ({ options = {}, address, customConfig = {} } = {}) => {
  const config = {
    data: {
      endpoint: 'txpool_getTransactionsFromPool',
      params: { address },
    },
    ...customConfig,
  };

  const result = useInvokeQuery({
    config,
    options: { ...options, enabled: !!address && options?.enabled !== false },
  });

  return result;
};
