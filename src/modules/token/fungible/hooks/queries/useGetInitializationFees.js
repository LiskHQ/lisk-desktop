import { useInvokeQuery } from '@common/hooks';
import { useGetHasUserAccount } from './useGetHasUserAccount';

export const useGetInitializationFees = ({ options = {}, address, tokenID }) => {
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

  const { data: hasUserAccountInitialized } = useGetHasUserAccount(queryConfig);

  const isAccountInitialized = hasUserAccountInitialized?.data?.exists;

  const result = useInvokeQuery({
    config,
    options: { ...options },
  });

  return {
    isAccountInitialized,
    initializationFees: { ...result?.data?.data },
  };
};
