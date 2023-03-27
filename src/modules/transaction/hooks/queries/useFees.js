import { FEES } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for transaction fees query
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query parameters
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useFees = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/fees`,
    method: 'get',
    event: 'get.fees',
    ...customConfig,
  };
  return useCustomQuery({
    keys: [FEES],
    config,
    options,
  });
};
