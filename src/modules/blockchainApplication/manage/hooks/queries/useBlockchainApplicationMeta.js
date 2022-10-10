import { BLOCKCHAIN_APPS_META } from 'src/const/queries';
import {
  API_VERSION,
} from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';
import { API_BASE_URL } from 'src/utils/api/constants';

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
    baseURL: API_BASE_URL,
    url: `/api/${API_VERSION}/blockchain/apps/meta`,
    method: 'get',
    event: 'get.blockchain.apps.meta',
    ...customConfig,
    params: { ...(customConfig?.params || {}) },
  };

  return useCustomQuery({
    keys: [BLOCKCHAIN_APPS_META],
    config,
    options,
  });
};
