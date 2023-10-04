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
