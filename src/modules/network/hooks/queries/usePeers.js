import { useInfiniteQuery } from '@tanstack/react-query';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { APPLICATION, PEERS } from 'src/const/queries';
import {
  METHOD,
  API_VERSION,
  API_METHOD,
  LIMIT as limit,
} from 'src/const/config';

// eslint-disable-next-line import/prefer-default-export
export const usePeers = ({ config: customConfig = {}, options } = { }) => {
  const [currentApplication] = useCurrentApplication();
  const config = {
    baseURL: currentApplication?.apis[0][METHOD] ?? currentApplication?.apis[0].rest,
    path: `/api/${API_VERSION}/peers`,
    event: 'get.peers',
    ...customConfig,
    params: { limit, ...customConfig.params },
  };

  return useInfiniteQuery(
    [PEERS, APPLICATION, METHOD, config],
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

