import { useInvokeQuery } from '@common/hooks';
import { useTokensBalance } from 'src/modules/token/fungible/hooks/queries';
import { useAuth } from './useAuth';

export const useGetInitializationFees = ({ options = {}, address } = {}) => {
  const config = {
    data: {
      endpoint: 'token_getInitializationFees',
      params: {},
    },
  };

  const queryConfig = {
    options: { enabled: !!address },
    config: { params: { address } },
  };

  const { data: auth, isLoading: isAuthLoading } = useAuth(queryConfig);
  const { data: token, isLoading: isTokenLoading } = useTokensBalance(queryConfig);

  const isAccountInitialized = auth?.data?.nonce !== '0' && +token?.data?.[0]?.availableBalance > 0;
  const shouldReturnInitalizationFee = !isAccountInitialized && !isAuthLoading && !isTokenLoading;

  const result = useInvokeQuery({
    config,
    options: { ...options, enabled: shouldReturnInitalizationFee },
  });

  return shouldReturnInitalizationFee ? result : { data: null };
};
