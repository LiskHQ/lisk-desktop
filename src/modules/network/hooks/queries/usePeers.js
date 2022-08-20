import { APPLICATION, PEERS } from 'src/const/queries';
import {
  METHOD,
  API_VERSION,
  LIMIT as limit,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks/queries';

// eslint-disable-next-line import/prefer-default-export
export const usePeers = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/peers`,
    event: 'get.peers',
    method: 'get',
    ...customConfig,
    params: { limit, ...customConfig.params },
  };

  const keys = [PEERS, APPLICATION, METHOD, config];
  return useCustomInfiniteQuery({ config, options, keys });
};
