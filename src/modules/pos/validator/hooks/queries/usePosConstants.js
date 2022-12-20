import { POS_CONSTANTS } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for dpos constants queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {Object} configuration.config - the query config
 * @param {Object} configuration.config.params - the query config params
 * @param {string} configuration.config.params.address - auth address
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const usePosConstants = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/pos/constants`,
    method: 'get',
    event: 'get.pos.constants',
    ...customConfig,
  };

  return useCustomQuery({
    keys: [POS_CONSTANTS],
    config,
    options,
  });
};
