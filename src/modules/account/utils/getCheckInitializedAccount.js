import { useAuthConfig } from '@auth/hooks/queries';
import { useTokensBalanceConfig } from '@token/fungible/hooks/queries';
import defaultClient from 'src/utils/api/client';

export const getCheckInitializedAccount = async ({ config, client = defaultClient }) => {
  const authConfig = useAuthConfig(config);
  const tokenBalanceConfig = useTokensBalanceConfig(config);

  const [tokens, auth] = await Promise.all([
    client.call(tokenBalanceConfig),
    client.call(authConfig),
  ]);

  const balances = tokens?.data?.reduce((sum, { availableBalance }) => sum + availableBalance, 0);
  const balanceCheck = parseInt(balances, 10) > 0;
  const nonceCheck = parseInt(auth?.data?.nonce ?? 0, 10) > 0;
  return tokens?.data && auth?.data ? balanceCheck || nonceCheck : false;
};
