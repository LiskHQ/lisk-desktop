/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { LEGACY, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

/**
 * Creates a custom hook for legacy account queries
 *
 * @param {object} configuration - the custom query configuration object
 * @param {object} configuration.config - the query config
 * @param {object} configuration.config.params - the query config params
 * @param {string} configuration.config.params.publicKey - account public key
 * @param {string} configuration.options - the query options
 *
 * @returns the query object
 */
// eslint-disable-next-line import/prefer-default-export
export const useLegacy = ({ config: customConfig = {}, options } = {}) => {
  const [currentApplication] = useCurrentApplication();
  const config = {
    baseURL: currentApplication?.apis[0][METHOD] ?? currentApplication?.apis[0].rest,
    path: `/api/${API_VERSION}/legacy`,
    event: 'get.legacy',
    ...customConfig,
    params: { publicKey: '', ...customConfig.params },
  };
  return useQuery(
    [LEGACY, APPLICATION, METHOD, config],
    async () => API_METHOD[METHOD]({
      ...config,
      params: {
        ...(config.params || {}),
      },
    }),
    {
      ...options,
    },
  );
};
