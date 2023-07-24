import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

/**
 * Custom React hook for retrieving schemas from the network
 * This hook can be called at the time of creating or signing
 * a transaction
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query parameters
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */
export const useSchemas = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/schemas`,
    method: 'get',
    event: 'get.schemas',
    ...customConfig,
  };

  return useCustomQuery({
    keys: ['schemas', customConfig.serviceURL],
    config,
    options,
  });
};
