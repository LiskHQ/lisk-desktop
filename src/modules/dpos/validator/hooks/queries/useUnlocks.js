import { UNLOCKS, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
// import { useInfiniteQuery } from '@tanstack/react-query';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks/queries';

/**
 * Creates a custom hook for votes unlocks queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {number} [configuration.config.params.limit] - the query limit
 * @param {number} [configuration.config.params.offset] - the query offset
 * @param {string} [configuration.config.params.address] - account address
 * @param {string} [configuration.config.params.publicKey] - account public key
 * @param {string} [configuration.config.params.name] - account name
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */
// eslint-disable-next-line import/prefer-default-export
export const useUnlocks = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/dpos/unlocks`,
    method: 'get',
    event: 'get.dpos.unlocks',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };
  const customOptions = {
    ...options,
    select: (data) => data.pages.reduce((prevPages, page) => {
      const newData = page?.data || {};
      const newUnlocks = page?.data.unlocking || [];
      return {
        ...page,
        data: {
          ...newData,
          unlocking: prevPages.data
            ? [...prevPages.data.unlocking, ...newUnlocks]
            : newUnlocks,
        },
      };
    }),
    getNextPageParam: (lastPage) => {
      const offset = lastPage.meta.count + lastPage.meta.offset;
      const hasMore = offset < lastPage.meta.total;
      return !hasMore ? undefined : { offset };
    },
  };
  const keys = [UNLOCKS, APPLICATION, METHOD, config];
  return useCustomInfiniteQuery({
    keys,
    options: customOptions,
    config,
  });
};
