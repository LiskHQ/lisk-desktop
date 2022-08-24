import { BLOCKCHAIN_APPS_META } from 'src/const/queries';
import {
  LIMIT as limit,
  API_VERSION,
} from 'src/const/config';
import { useCustomInfiniteQuery } from 'src/modules/common/hooks';

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
// eslint-disable-next-line import/prefer-default-export
export const useBlockchainApplicationMeta = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/blockchain/apps/meta`,
    method: 'get',
    event: 'get.blockchain.apps.meta',
    ...customConfig,
    params: { limit, ...(customConfig?.params || {}) },
  };
  return useCustomInfiniteQuery({
    keys: [BLOCKCHAIN_APPS_META],
    config,
    options,
  });
};
