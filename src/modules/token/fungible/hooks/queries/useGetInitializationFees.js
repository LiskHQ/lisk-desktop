import { useInvokeQuery } from '@common/hooks';
import { useGetHasUserAccount } from './useGetHasUserAccount';

export const useGetInitializationFees = ({ options = {}, address, tokenID } = {}) => {
  const config = {
    data: {
      endpoint: 'token_getInitializationFees',
      params: {},
    },
  };

  const queryConfig = {
    options: { enabled: !!address },
    config: { params: { address, tokenID } },
  };

  const { data: hasUserAccountInitialized, isLoading: isHasUserAccountLoading } =
    useGetHasUserAccount(queryConfig);

  const isAccountInitialized = hasUserAccountInitialized?.data?.exists;
  const shouldReturnInitializationFee = !isAccountInitialized && !isHasUserAccountLoading;

  const result = useInvokeQuery({
    config,
    options: { ...options, enabled: shouldReturnInitializationFee },
  });

  return shouldReturnInitializationFee ? result : { data: null };
};
