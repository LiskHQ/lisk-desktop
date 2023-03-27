import { useInvokeQuery } from '@common/hooks';

export const useGetMinimumMessageFee = ({ options = {} } = {}) => {
  const config = {
    data: {
      endpoint: 'interoperability_getMinimumMessageFee',
      params: {},
    },
  };

  const result = useInvokeQuery({
    config,
    options: { ...options },
  });

  return result;
};
