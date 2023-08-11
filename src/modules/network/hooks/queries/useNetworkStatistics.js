import { NETWORK_STATISTICS } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks/useCustomQuery';

export const useNetworkStatistics = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/network/statistics`,
    method: 'get',
    event: 'get.network.statistics​',
    ...customConfig,
  };
  return useCustomQuery({
    keys: [NETWORK_STATISTICS],
    config,
    options,
  });
};
