import { useInvokeQuery } from '@common/hooks';
import { INITIALIZATION_FEES } from 'src/const/queries';

export const useGetInitializationFees = ({
  options,
}) => {
  const config = {
    params: {
      endpoint: 'auth.getInitializationFees',
      params: {},
    },
  };

  return useInvokeQuery({ config, keys: [INITIALIZATION_FEES], options });
};
