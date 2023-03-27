/* istanbul ignore file */
import { useInfiniteQuery } from '@tanstack/react-query';
import defaultClient from 'src/utils/api/client';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';

/**
 * Creates a custom hook for inifinite queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {string[]} configuration.keys - the query keys
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.sort] - the query sort
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useCustomInfiniteQuery = ({ keys, config, options = {}, client = defaultClient }) => {
  const [{ chainID }] = useCurrentApplication();

  return useInfiniteQuery(
    [...keys, chainID, config],
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
