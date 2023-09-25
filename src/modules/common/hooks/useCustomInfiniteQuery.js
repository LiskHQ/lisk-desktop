/* istanbul ignore file */
import { useInfiniteQuery } from '@tanstack/react-query';
import defaultClient from 'src/utils/api/client';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';

export const useCustomInfiniteQuery = ({ keys, config, options = {}, client = defaultClient }) => {
  const [{ chainID }] = useCurrentApplication();

  return useInfiniteQuery(
    [...keys, chainID, config, client.host],
    async ({ pageParam }) =>
      client.call({
        ...config,
        params: {
          ...(config.params || {}),
          ...pageParam,
        },
      }),
    {
      getNextPageParam: (lastPage = {}) => {
        const lastPageCount = lastPage.meta?.count || 0;
        const lastPageOffset = lastPage.meta?.offset || 0;

        const offset = lastPageCount + lastPageOffset;
        const hasMore = offset < (lastPage.meta?.total ?? Infinity);
        return !hasMore ? undefined : { offset };
      },
      select: (data) =>
        data.pages.reduce((prevPages, page) => {
          const newData = page?.data || [];
          return {
            ...page,
            data: prevPages.data ? [...prevPages.data, ...newData] : newData,
          };
        }, {}),
      ...options,
    }
  );
};
