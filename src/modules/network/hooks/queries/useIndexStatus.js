import { INDEX_STATUS } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

export const useIndexStatus = ({ config: customConfig = {}, options, client } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/index/status`,
    method: 'get',
    event: 'get.index.status',
    ...customConfig,
  };
  return useCustomQuery({
    keys: [INDEX_STATUS],
    config,
    options,
    client,
  });
};
