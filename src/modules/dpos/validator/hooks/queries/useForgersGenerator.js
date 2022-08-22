import { GENERATOR, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks/queries';

// eslint-disable-next-line import/prefer-default-export
export const useForgersGenerator = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/generators`,
    method: 'get',
    event: 'get.generators',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };

  const keys = [GENERATOR, APPLICATION, METHOD, config];

  return useCustomInfiniteQuery({ config, options, keys });
};
