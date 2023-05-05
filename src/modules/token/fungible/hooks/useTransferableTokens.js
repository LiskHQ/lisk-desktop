import { useMemo, useRef } from 'react';
import { useTokenBalances, useTokensSupported } from '@token/fungible/hooks/queries';
import { Client } from 'src/utils/api/client';

export const useTransferableTokens = (application) => {
  const client = useRef(new Client());
  client.current.create(application?.serviceURLs?.[0]);

  const {
    data: { data: myTokens = [] } = {},
    isSuccess: isTokensSuccess,
    isLoading: isTokenLoading,
  } = useTokenBalances();
  const {
    data: { data: { supportedTokens } = {} } = {},
    isSuccess: isSupportedSuccess,
    isLoading: isSupportLoading,
  } = useTokensSupported({ client: client.current });
  return useMemo(() => {
    const isSuccess = isTokensSuccess && isSupportedSuccess;
    const isLoading = isTokenLoading || isSupportLoading;
    const isSupportAllToken = supportedTokens?.isSupportAllTokens;
    const exactTokensSupported = !isSuccess
      ? []
      : myTokens.filter((token) =>
          supportedTokens?.exactTokenIDs.find((tokenID) => tokenID === token.tokenID)
        );
    const patternTokensSupported = !isSuccess
      ? []
      : supportedTokens?.patternTokenIDs
          .map((pattern) => {
            const chainID = pattern.slice(0, 8);
            return myTokens.filter((token) => chainID === token.tokenID.slice(0, 8));
          })
          .flatMap((res) => res);
    const supportedAppTokens = [...(patternTokensSupported || []), ...exactTokensSupported];
    const tokens = isSupportAllToken ? myTokens : Array.from(new Set(supportedAppTokens));
    return {
      isLoading,
      isSuccess,
      data: isSuccess ? tokens : [],
    };
  }, [isTokensSuccess, isSupportedSuccess, isTokenLoading, isSupportLoading, application]);
};
