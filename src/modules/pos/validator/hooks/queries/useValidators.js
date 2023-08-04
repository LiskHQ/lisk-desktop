import { VALIDATORS } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

export const useValidators = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/pos/validators`,
    method: 'get',
    event: 'get.pos.validators',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };

  return useCustomInfiniteQuery({
    keys: [VALIDATORS],
    config,
    options,
  });
};
