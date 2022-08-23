import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { CCM, APPLICATION } from 'src/const/queries';
import { useCustomInfiniteQuery } from './useCustomInfiniteQuery';

// eslint-disable-next-line import/prefer-default-export
export const useCcm = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/ccm`,
    method: 'get',
    event: 'get.ccm',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };
  const keys = [CCM, APPLICATION, METHOD, config];
  return useCustomInfiniteQuery({
    keys,
    config,
    options,
  });
};
