/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query';
import { MARKET_PRICES, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

// eslint-disable-next-line import/prefer-default-export
export const useMarketPrices = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/market/prices`,
    method: 'get',
    event: 'get.market.prices',
    ...customConfig,
    params: { ...customConfig.params },
  };
  return useQuery(
    [MARKET_PRICES, APPLICATION, METHOD, config],
    async () => API_METHOD[METHOD]({
      ...config,
      params: {
        ...(config.params || {}),
      },
    }),
    {
      ...options,
    },
  );
};
