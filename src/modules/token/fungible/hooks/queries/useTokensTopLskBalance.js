/* istanbul ignore file */
import { TOKENS_TOP_LSK_BALANCE, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks/queries';

// eslint-disable-next-line import/prefer-default-export
export const useTokensTopLskBalance = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/tokens/lsk/top`,
    method: 'get',
    event: 'get.tokens.lsk.top',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };
  const keys = [TOKENS_TOP_LSK_BALANCE, APPLICATION, METHOD, config];
  return useCustomInfiniteQuery({ config, options, keys });
};
