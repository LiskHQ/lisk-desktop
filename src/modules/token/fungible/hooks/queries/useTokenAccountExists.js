/* istanbul ignore file */
import { useCustomQuery } from 'src/modules/common/hooks';
import { API_VERSION } from 'src/const/config';
import { TOKENS_ACCOUNT_EXISTS } from 'src/const/queries';

/**
 * Creates a custom hook for token account exists
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {string} [configuration.config.params.address] - account address
 * @param {string} [configuration.config.params.publicKey] - account public key
 * @param {string} [configuration.config.params.name] - registered account name
 * @param {string} [configuration.config.params.tokenID] - token ID
 *
 * @returns the query object
 */

export const useTokenAccountExists = ({ config: customConfig = {}, options } = {}) => {
  const config = {
    url: `/api/${API_VERSION}/token/account/exists`,
    method: 'get',
    event: 'get.token.account.exists',
    ...customConfig,
    params: { ...customConfig.params },
  };
  return useCustomQuery({ keys: [TOKENS_ACCOUNT_EXISTS], config, options });
};
