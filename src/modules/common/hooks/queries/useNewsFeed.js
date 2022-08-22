import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { NEWSFEED } from 'src/const/queries';
import { useCustomInfiniteQuery } from './useCustomInfiniteQuery';

// eslint-disable-next-line import/prefer-default-export
export const useNewsFeed = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/newsfeed`,
    method: 'get',
    event: 'get.newsfeed',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };
  const keys = [NEWSFEED, METHOD, config];
  return useCustomInfiniteQuery({
    keys,
    config,
    options,
  });
};
