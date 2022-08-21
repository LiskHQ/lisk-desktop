import { VOTES_SENT, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';
import { useInfiniteQuery } from '@tanstack/react-query';

// eslint-disable-next-line import/prefer-default-export
export const useSentVotes = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/dpos/votes/sent`,
    method: 'get',
    event: 'get.dpos.votes.sent',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };

  return useInfiniteQuery(
    [VOTES_SENT, APPLICATION, METHOD, config],
    async ({ pageParam }) => API_METHOD[METHOD]({
      ...config,
      params: {
        ...(config.params || {}),
        ...pageParam,
      },
    }),
    {
      ...options,
      select: (data) => data.pages.reduce((prevPages, page) => {
        const newData = page?.data || {};
        const newVotes = page?.data.votes || [];
        return {
          ...page,
          data: {
            ...newData,
            votes: prevPages.data ? [...prevPages.data.votes, ...newVotes] : newVotes,
          },
        };
      }),
      getNextPageParam: (lastPage) => {
        const offset = lastPage.meta.count + lastPage.meta.offset;
        const hasMore = offset < lastPage.meta.total;
        return !hasMore ? undefined : { offset };
      },
    },
  );
};
