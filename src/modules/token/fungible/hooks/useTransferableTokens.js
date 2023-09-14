import { useNetworkSupportedTokens, useTokenBalances } from '@token/fungible/hooks/queries';
import { useMemo } from 'react';

export const useTransferableTokens = (application) => {
  const networkSupportedTokens = useNetworkSupportedTokens(application);
  const tokenBalances = useTokenBalances({
    options: { enabled: networkSupportedTokens.isFetched },
  });

  const transferrableTokens =
    tokenBalances.data?.data?.filter(({ tokenID }) =>
      networkSupportedTokens.data.find(
        (networkSupportedToken) => networkSupportedToken.tokenID === tokenID
      )
    ) || [];

  const nonNativeTokens = transferrableTokens.filter(
    ({ chainID }) => chainID !== application.chainID
  );
  const nativeToken = transferrableTokens.filter(({ chainID }) => chainID === application.chainID);
  const resultTokens = useMemo(
    () => nativeToken.concat(nonNativeTokens),
    [networkSupportedTokens.isFetched, tokenBalances.isFetched, application]
  );

  return {
    isLoading: tokenBalances.isLoading || networkSupportedTokens.isLoading,
    isSuccess:
      tokenBalances.isSuccess &&
      !networkSupportedTokens.isError &&
      !networkSupportedTokens.isLoading,
    data: resultTokens,
  };
};
