import { BLOCKCHAIN_APPS } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks/queries';

// eslint-disable-next-line import/prefer-default-export
export const useBlockchainApplicationExplore = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/blockchain/apps`,
    method: 'get',
    event: 'get.blockchain.apps',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };

  const keys = [BLOCKCHAIN_APPS, METHOD, config];

  return useCustomInfiniteQuery({ config, options, keys });
};
