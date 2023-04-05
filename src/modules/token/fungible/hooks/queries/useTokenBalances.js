/* istanbul ignore file */
import { TOKENS_BALANCE } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';
import { useCurrentAccount } from '@account/hooks';
import { useAppsMetaTokensConfig } from '@token/fungible/hooks/queries/useAppsMetaTokens';
import { addTokensMetaData } from '@token/fungible/utils/addTokensMetaData';
import defaultClient from 'src/utils/api/client';

export const useTokenBalancesConfig = (config) => ({
  url: `/api/${API_VERSION}/token/balances`,
  method: 'get',
  event: 'get.token.balances',
  ...config,
  params: { limit, ...(config.params || {}) },
});

export const useTokenBalances = ({
  config: customConfig = {},
  options,
  client = defaultClient,
} = {}) => {
  const [currentAccount] = useCurrentAccount();
  const { address } = customConfig.params?.address || currentAccount.metadata || {};
  const createMetaConfig = useAppsMetaTokensConfig();
  const transformToken = addTokensMetaData({ createMetaConfig, client });
  const transformResult = async (res) => {
    const tokens = await transformToken(res.data);
    return {
      ...res,
      data: tokens,
    };
  };

  const config = useTokenBalancesConfig({
    ...customConfig,
    transformResult,
    params: { address, ...(customConfig.params || {}) },
  });

  return useCustomInfiniteQuery({
    keys: [TOKENS_BALANCE],
    config,
    options,
    client,
  });
};
