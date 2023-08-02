/* istanbul ignore file */
import { TRANSACTION_STATISTICS } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

export const useTransactionStatistics = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/transactions/statistics`,
    method: 'get',
    event: 'get.transactions.statistics',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };
  const customOptions = {
    ...options,
    select: (data) =>
      data.pages.reduce((prevPages, page) => {
        const newData = page?.data || {};
        const newTimelines = page?.data.timeline || {};
        const mergedTimelines = Object.keys(prevPages.data.timeline).reduce(
          (acc, key) => ({
            ...acc,
            [key]: [...prevPages.data.timeline[key], ...newTimelines[key]],
          }),
          {}
        );
        return {
          ...page,
          data: {
            ...newData,
            timeline: prevPages.data ? mergedTimelines : newTimelines,
          },
        };
      }),
  };
  return useCustomInfiniteQuery({
    keys: [TRANSACTION_STATISTICS],
    options: customOptions,
    config,
  });
};
