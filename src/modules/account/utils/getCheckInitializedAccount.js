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

  const balances = tokens?.data?.reduce((sum, { availableBalance }) => sum + BigInt(availableBalance), BigInt(0));
  const isBalanceGreaterThanZero = BigInt(balances || 0) > BigInt(0);
  const isNonceGreaterThanZero = BigInt(auth?.data?.nonce || 0) > BigInt(0);

  return tokens?.data && auth?.data ? isBalanceGreaterThanZero || isNonceGreaterThanZero : false;
};
