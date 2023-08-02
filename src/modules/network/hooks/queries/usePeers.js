import { PEERS } from 'src/const/queries';
import { API_VERSION, LIMIT as limit } from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

export const usePeers = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/network/peers`,
    event: 'get.peers',
    method: 'get',
    ...customConfig,
    params: { limit, ...customConfig.params },
  };

  return useCustomInfiniteQuery({
    keys: [PEERS],
    config,
    options,
  });
};
