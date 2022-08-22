import { EVENTS, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks/queries';

// eslint-disable-next-line import/prefer-default-export
export const useTransactionEvents = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/events`,
    method: 'get',
    event: 'get.events',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };

  const keys = [EVENTS, APPLICATION, METHOD, config];

  return useCustomInfiniteQuery({ config, options, keys });
};
