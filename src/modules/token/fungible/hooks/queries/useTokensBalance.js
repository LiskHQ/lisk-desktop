/* istanbul ignore file */
import { TOKENS_BALANCE, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks/queries';

// eslint-disable-next-line import/prefer-default-export
export const useTokensBalance = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/tokens`,
    method: 'get',
    event: 'get.tokens',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };
  const keys = [TOKENS_BALANCE, APPLICATION, METHOD, config];
  return useCustomInfiniteQuery({ config, options, keys });
};
