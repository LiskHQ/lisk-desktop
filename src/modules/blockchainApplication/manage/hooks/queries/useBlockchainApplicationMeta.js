import { BLOCKCHAIN_APPS_META } from 'src/const/queries';
import { LIMIT as limit, API_VERSION } from 'src/const/config';
import defaultClient from 'src/utils/api/client';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

export const useBlockchainApplicationMeta = ({
  config: customConfig = {},
  options,
  client = defaultClient,
} = {}) => {
  const config = {
    url: `/api/${API_VERSION}/blockchain/apps/meta`,
    method: 'get',
    ...customConfig,
    event: 'get.blockchain.apps.meta',
    params: {
      limit,
      ...(customConfig?.params || {}),
    },
  };

  return useCustomInfiniteQuery({
    keys: [BLOCKCHAIN_APPS_META],
    config,
    client,
    options,
  });
};
