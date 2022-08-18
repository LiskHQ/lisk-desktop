/* istanbul ignore file */
import { useQuery } from '@tanstack/react-query';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { LEGACY, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

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
