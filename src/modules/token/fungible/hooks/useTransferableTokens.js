import { useMemo, useRef } from 'react';
import { useTokensBalance, useTokensSupported } from '@token/fungible/hooks/queries';
import { Client } from 'src/utils/api/client';

export const useTransferableTokens = (application) => {
  const client = useRef(new Client());
  client.current.create(application?.apis[0]);

  const {
    data: { data: myTokens = [] } = {},
    isSuccess: isTokensSuccess,
    isLoading: isTokenLoading,
  } = useTokensBalance();
  const {
    data: { data: { supportedTokens } = {} } = {},
    isSuccess: isSupportedSuccess,
    isLoading: isSupportLoading,
  } = useTokensSupported({ client: client.current });
  return useMemo(() => {
    const isSuccess = isTokensSuccess && isSupportedSuccess;
    const isLoading = isTokenLoading || isSupportLoading;
    const isSupportAllToken = supportedTokens?.length === 0;
    const tokens = isSupportAllToken
      ? myTokens
      : myTokens.filter((token) =>
          supportedTokens?.find((supportedToken) => supportedToken.tokenID === token.tokenID)
        );
    return {
      isLoading,
      isSuccess,
      data: isSuccess ? tokens : [],
    };
  }, [isTokensSuccess, isSupportedSuccess, isTokenLoading, isSupportLoading]);
};
