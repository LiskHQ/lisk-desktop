/* istanbul ignore file */
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  METHOD,
  API_METHOD,
} from 'src/const/config';

// eslint-disable-next-line import/prefer-default-export
export const useCustomInfiniteQuery = ({
  keys = [],
  config = {},
  options = {},
}) => useInfiniteQuery(
  keys,
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
      const newData = page?.data || [];
      return {
        ...page,
        data: prevPages.data ? [...prevPages.data, ...newData] : newData,
      };
    }),
    getNextPageParam: (lastPage) => {
      const offset = lastPage.meta.count + lastPage.meta.offset;
      const hasMore = offset < (lastPage?.meta?.total ?? Infinity);
      return !hasMore ? undefined : { offset };
    },
  },
);
