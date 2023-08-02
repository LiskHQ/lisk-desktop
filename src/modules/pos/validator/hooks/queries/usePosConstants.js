import { POS_CONSTANTS } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for pos constants queries
 * @returns the query object
 */

export const usePosConstants = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/pos/constants`,
    method: 'get',
    event: 'get.pos.constants',
    ...customConfig,
  };

  // @TODO: we need to change the caching time from 5mins to something larger since this is a constant that doesn't frequently change
  return useCustomQuery({
    keys: [POS_CONSTANTS],
    config,
    options: {
      staleTime: Infinity,
      cacheTime: Infinity,
      ...options,
    },
  });
};
