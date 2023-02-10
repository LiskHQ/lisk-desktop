import { AUTH } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for command parameters schemas queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {Object} configuration.config - the query config
 * @param {Object} configuration.config.params - the query config params
 * @param {string} configuration.config.params.address - auth address
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */
export const useAuthConfig = (config) => ({
    url: `/api/${API_VERSION}/auth`,
    method: 'get',
    event: 'get.auth',
    ...config,
  });

export const useAuth = ({ config: customConfig = {}, options } = {}) => {
  const config = useAuthConfig(customConfig);
  return useCustomQuery({
    keys: [AUTH],
    config,
    options,
  });
};
