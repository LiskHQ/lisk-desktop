/* istanbul ignore file */
import { useAppsMetaTokens } from '@token/fungible/hooks/queries/useAppsMetaTokens';
import { useFees } from 'src/modules/transaction/hooks/queries';
import { useTokenBalances } from './useTokenBalances';

export const useValidateFeeBalance = (customFeeTokenId) => {
  const { data: myTokenBalances } = useTokenBalances();
  const feesQuery = useFees({ options: { enabled: !customFeeTokenId } });
  const feeTokenID = customFeeTokenId || feesQuery.data?.data?.feeTokenID;
  const foundTokenBalance = myTokenBalances?.data?.some(
    (tokenBalance) =>
      tokenBalance?.tokenID === feeTokenID &&
      BigInt(tokenBalance?.availableBalance || 0) > BigInt(0)
  );

  const appMetaTokensQuery = useAppsMetaTokens({
    config: { params: { tokenID: feeTokenID, limit: 1 } },
    options: { enabled: !!feeTokenID },
  });

  return {
    hasSufficientBalanceForFee: !!foundTokenBalance,
    isLoading: feesQuery.isLoading || appMetaTokensQuery.isLoading,
    feeToken: appMetaTokensQuery.data?.data?.[0],
  };
};
