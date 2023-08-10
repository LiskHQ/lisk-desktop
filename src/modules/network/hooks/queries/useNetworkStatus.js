import { NETWORK_STATUS } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

export const useNetworkStatus = ({ config: customConfig = {}, options, client } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/network/status`,
    method: 'get',
    event: 'get.network.status',
    ...customConfig,
  };
  return useCustomQuery({
    keys: [NETWORK_STATUS],
    config,
    options,
    client,
  });
};
