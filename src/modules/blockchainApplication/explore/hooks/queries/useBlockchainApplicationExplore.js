import { BLOCKCHAIN_APPS } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

export const useBlockchainApplicationExplore = ({
  config: customConfig = {},
  options,
  client,
} = {}) => {
  const config = {
    url: `/api/${API_VERSION}/blockchain/apps`,
    method: 'get',
    event: 'get.blockchain.apps',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };

  return useCustomInfiniteQuery({
    config,
    options,
    client,
    keys: [BLOCKCHAIN_APPS],
  });
};
