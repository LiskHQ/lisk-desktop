/* istanbul ignore file */
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { TOKENS_TOP_LSK_BALANCE, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

// eslint-disable-next-line import/prefer-default-export
export const useTokensTopLskBalance = ({ config: customConfig = {}, options } = {}) => {
  const [currentApplication] = useCurrentApplication();
  const config = {
    baseURL: currentApplication?.apis[0][METHOD] ?? currentApplication?.apis[0].rest,
    path: `/api/${API_VERSION}/tokens/lsk/top`,
    event: 'get.tokens.lsk.top',
    ...customConfig,
    params: { limit, ...customConfig.params },
  };
  return useInfiniteQuery(
    [TOKENS_TOP_LSK_BALANCE, APPLICATION, METHOD, config],
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
        const hasMore = offset < lastPage.meta.total;
        return !hasMore ? undefined : { offset };
      },
    },
  );
};
