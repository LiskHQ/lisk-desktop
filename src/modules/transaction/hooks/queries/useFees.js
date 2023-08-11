import { FEES } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

export const useFees = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/fees`,
    method: 'get',
    event: 'get.fees',
    ...customConfig,
  };
  return useCustomQuery({
    keys: [FEES],
    config,
    options,
  });
};
