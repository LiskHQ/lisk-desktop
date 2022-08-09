import { useInfiniteQuery } from '@tanstack/react-query';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { BLOCKS, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';
import { wsMethods } from '../../config';

// eslint-disable-next-line import/prefer-default-export
export const useBlocks = ({ config: customConfig = {}, options } = { }) => {
  const [currentApplication] = useCurrentApplication();
  const config = {
    baseUrl: currentApplication?.apis[0][METHOD] ?? currentApplication?.apis[0].rest,
    path: `/api/${API_VERSION}/blocks`,
    event: wsMethods.blocksChange,
    ...customConfig,
    params: { limit, ...customConfig.params },
  };
  const result = useInfiniteQuery(
    [BLOCKS, APPLICATION, METHOD, config],
    async ({ pageParam }) => API_METHOD[METHOD]({
      ...config,
      params: {
        ...(config.params || {}),
        ...pageParam,
      },
    }),
    {
      ...options,
      select: (data) => data.pages.reduce((prevPages, page) => ({
        ...page,
        data: prevPages?.data ? [...prevPages.data, ...page?.data] : page?.data,
      }), {}),
      getNextPageParam: (lastPage) => {
        const offset = lastPage.meta.count + lastPage.meta.offset;
        const hasMore = offset < lastPage.meta.total;
        return !hasMore ? undefined : { offset };
      },
      placeholderData: {
        data: [],
        pages: [],
        pageParams: [],
      },
    },
  );
  return {
    ...result,
    hasUpdate: false,
    addUpdate: () => undefined,
  };
};
