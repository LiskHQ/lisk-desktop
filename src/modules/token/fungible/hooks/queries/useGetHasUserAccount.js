import { useInvokeQuery } from '@common/hooks';

export const useGetHasUserAccount = ({ options = {}, config: customConfig = {}, } = {}) => {
  const config = {
    data: {
      endpoint: 'token_hasUserAccount',
      params: {
        address: customConfig.params?.address,
        tokenID: customConfig.params?.tokenID,
      },
    },
  };

  const result = useInvokeQuery({
    config,
    options: { ...options, },
  });

  return result;
};
