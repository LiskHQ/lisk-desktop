import { TRANSACTIONS, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks/queries';

// eslint-disable-next-line import/prefer-default-export
export const useTransactions = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/transactions`,
    method: 'get',
    event: 'update.transactions',
    ...customConfig,
    params: { limit, ...customConfig.params },
  };
  const keys = [TRANSACTIONS, APPLICATION, METHOD, config];
  return useCustomInfiniteQuery({ config, options, keys });
};
