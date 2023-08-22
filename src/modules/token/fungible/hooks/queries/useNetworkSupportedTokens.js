import { useMemo, useRef } from 'react';
import { useAppsMetaTokens, useTokenSummary } from '@token/fungible/hooks/queries';
import { Client } from 'src/utils/api/client';

export const useNetworkSupportedTokens = (application) => {
  const client = useRef(new Client());
  client.current.create(application?.serviceURLs?.[0]);

  const tokensSupported = useTokenSummary({ client: client.current });
  const isSupportAllTokens = tokensSupported.data?.data?.supportedTokens?.isSupportAllTokens;

  const appsMetaTokens = useAppsMetaTokens({
    options: { enabled: isSupportAllTokens },
    config: { params: { chainID: application?.chainID } },
    client: client.current,
  });
  const isLoading = tokensSupported.isLoading || appsMetaTokens.isLoading;
  const isFetched = tokensSupported.isFetched && appsMetaTokens.isFetched;
  const isError = tokensSupported.isError || appsMetaTokens.isError;

  return useMemo(() => {
    let tokens = [];
    if (!isSupportAllTokens) {
      const { exactTokenIDs = [] } = tokensSupported.data?.data?.supportedTokens || {};
      tokens = exactTokenIDs
        .map((exactTokenID) =>
          appsMetaTokens.data?.data?.find(({ tokenID }) => tokenID === exactTokenID)
        )
        .filter((token) => token);
    } else {
      tokens = appsMetaTokens.data?.data || [];
    }

    return {
      isLoading,
      isFetched,
      isError,
      data: tokens,
    };
  }, [isLoading, isFetched, isError]);
};
