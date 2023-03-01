import { useInvokeQuery } from '@common/hooks';
import { useTokensBalance } from 'src/modules/token/fungible/hooks/queries';
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

  const { data: hasUserAccount, isLoading: isHasUserAccountLoading } = useGetHasUserAccount(queryConfig);
  const { data: token, isLoading: isTokenLoading } = useTokensBalance(queryConfig);

  const isAccountInitialized = hasUserAccount?.data?.exists && token?.data?.[0]?.availableBalance && BigInt(token?.data?.[0]?.availableBalance) > BigInt(0);
  const shouldReturnInitializationFee = !isAccountInitialized && !isHasUserAccountLoading && !isTokenLoading;

  const result = useInvokeQuery({
    config,
    options: { ...options, enabled: shouldReturnInitializationFee },
  });

  return shouldReturnInitializationFee ? result : { data: null };
};
