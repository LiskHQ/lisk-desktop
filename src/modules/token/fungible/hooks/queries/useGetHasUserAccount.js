import { useInvokeQuery } from '@common/hooks';

export const useGetHasUserAccount = ({ options = {}, config: customConfig = {}, } = {}) => {
  const config = {
    data: {
      endpoint: 'token_hasUserAccount',
      params: {
        ...customConfig.params,
      },
    },
  };

  const result = useInvokeQuery({
    config,
    options: { ...options, },
  });

  return result;
};
