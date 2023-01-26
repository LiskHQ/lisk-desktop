import { useInvokeQuery } from '@common/hooks';
import { INVOKE } from 'src/const/queries';

export const useGetInitializationFees = ({ options = {} } = {}) => {
  const config = {
    data: {
      endpoint: 'token_getInitializationFees',
      params: {},
    },
  };

  return useInvokeQuery({ config, keys: [INVOKE], options });
};
