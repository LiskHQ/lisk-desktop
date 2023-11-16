import { useMemo } from 'react';
import { useAppsMetaTokens, useTokenSummary } from '@token/fungible/hooks/queries';
import { Client } from 'src/utils/api/client';

// eslint-disable-next-line max-statements
export const useNetworkSupportedTokens = (application) => {
  const serviceUrl = application?.serviceURLs?.[0].http;
  const client = useMemo(() => serviceUrl && new Client({ http: serviceUrl }), [serviceUrl]);

  const tokensSupported = useTokenSummary({ client });
  const isSupportAllTokens = tokensSupported.data?.data?.supportedTokens?.isSupportAllTokens;

  const appsMetaTokens = useAppsMetaTokens({
    config: { params: { chainID: undefined, network: application?.networkType } },
    client,
  });
  const isLoading = tokensSupported.isLoading || appsMetaTokens.isLoading;
  const isFetched = tokensSupported.isFetched && appsMetaTokens.isFetched;
  const isError = tokensSupported.isError || appsMetaTokens.isError;

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

  const nonNativeTokens = tokens.filter(({ chainID }) => chainID !== application.chainID);
  const nativeToken = tokens.filter(({ chainID }) => chainID === application.chainID);

  return {
    isLoading,
    isFetched,
    isError,
    data: [...nativeToken, ...nonNativeTokens],
  };
};
