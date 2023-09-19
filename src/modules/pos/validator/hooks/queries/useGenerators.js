import { GENERATOR } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for block generator queries
 *
 * @returns the query object
 */

export const useGenerators = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/generators`,
    method: 'get',
    event: 'get.generators',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };

  return useCustomInfiniteQuery({
    keys: [GENERATOR],
    config,
    options,
  });
};
