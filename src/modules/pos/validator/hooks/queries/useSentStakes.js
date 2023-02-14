/* istanbul ignore file */
import { STAKES_SENT } from 'src/const/queries';
import { API_VERSION } from 'src/const/config';
import { useCustomQuery } from 'src/modules/common/hooks';

/**
 * Creates a custom hook for stakes sent queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {string} [configuration.config.params.address] - account address
 * @param {string} [configuration.config.params.name] - account name
 * @param {string} [configuration.config.params.publicKey] - account public key
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */

export const useSentStakes = ({ config: customConfig = {}, options } = {}) => {
  const hasRequiredParams = customConfig.params?.address;

  const config = {
    url: `/api/${API_VERSION}/pos/stakes`,
    method: 'get',
    event: 'get.pos.stakes',
    ...customConfig,
  };

  return useCustomQuery({
    keys: [STAKES_SENT],
    config,
    options: {
      ...options,
      enabled: !!hasRequiredParams,
    },
  });
};
