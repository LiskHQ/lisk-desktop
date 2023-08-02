/* istanbul ignore file */
import { TOKEN_BALANCES_TOP } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

export const useTokensBalanceTop = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/token/balances/top`,
    method: 'get',
    event: 'get.token.balances.top',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };
  return useCustomInfiniteQuery({
    keys: [TOKEN_BALANCES_TOP],
    config,
    options,
  });
};
