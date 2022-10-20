import { useSelector } from 'react-redux';
import { BLOCKCHAIN_APPS_META } from 'src/const/queries';
import {
  API_VERSION,
} from 'src/const/config';
import { API_BASE_URL } from 'src/utils/api/constants';
import defaultClient from 'src/utils/api/client';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';
import { getNetworkName } from '@network/utils/getNetwork';

/**
 * Creates a custom hook for blockchain applications meta queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useBlockchainApplicationMeta = ({ config: customConfig = {}, options, client = defaultClient, limit } = { }) => {
  const selectedNetwork = useSelector(state => state.network);
  const network = getNetworkName(selectedNetwork)
  const config = {
    baseURL: API_BASE_URL,
    url: `/api/${API_VERSION}/blockchain/apps/meta`,
    method: 'get',
    ...customConfig,
    event: 'get.blockchain.apps.meta',
    params: { limit, ...(customConfig?.params || {}), network },
  };

  return useCustomInfiniteQuery({
    keys: [BLOCKCHAIN_APPS_META],
    config,
    client,
    options,
  });
};
