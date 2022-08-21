import { DELEGATES, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks/queries';

// eslint-disable-next-line import/prefer-default-export
export const useDelegates = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/dpos/delegates`,
    method: 'get',
    event: 'get.dpos.delegates',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };

  const keys = [DELEGATES, APPLICATION, METHOD, config];

  return useCustomInfiniteQuery({ config, options, keys });
};
