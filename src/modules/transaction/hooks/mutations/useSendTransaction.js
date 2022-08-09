import { useMutation } from '@tanstack/react-query';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

// eslint-disable-next-line import/prefer-default-export
export const useSendTransaction = (options) => {
  const [currentApplication] = useCurrentApplication();

  return useMutation(async ({ path, customConfig }) => {
    const config = {
      baseUrl: currentApplication?.apis[0][METHOD] ?? currentApplication?.apis[0].rest,
      path: `/api/${API_VERSION}/transactions/`,
      method: 'POST',
      event: 'get.network.status',
      ...customConfig,
      params: { limit, ...customConfig.params },
    };
    return API_METHOD[METHOD]({
      path,
      config,
    });
  },
  options);
};
