/* istanbul ignore file */
import { MARKET_PRICES } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

export const useMarketPrices = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/market/prices`,
    method: 'get',
    event: 'get.market.prices',
    ...customConfig,
    params: { ...customConfig.params },
  };
  return useCustomQuery({
    keys: [MARKET_PRICES],
    config,
    options,
  });
};
