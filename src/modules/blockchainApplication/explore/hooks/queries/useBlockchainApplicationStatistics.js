import { BLOCKCHAIN_APPS_STATISTICS } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

export const useBlockchainApplicationStatistics = ({
  config: customConfig = {},
  options,
  client,
} = {}) => {
  const config = {
    url: `/api/${API_VERSION}/blockchain/apps/statistics`,
    method: 'get',
    event: 'get.blockchain.apps.statistics',
    ...customConfig,
  };
  return useCustomQuery({
    keys: [BLOCKCHAIN_APPS_STATISTICS],
    config,
    options,
    client,
  });
};
