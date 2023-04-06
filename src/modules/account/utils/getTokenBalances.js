import defaultClient from 'src/utils/api/client';
import { useTokenBalancesConfig } from 'src/modules/token/fungible/hooks/queries';

export const getTokenBalances = async (address) => {
  const config = useTokenBalancesConfig({ params: { address } });

  const res = await defaultClient.call(config);

  return res?.data;
};
