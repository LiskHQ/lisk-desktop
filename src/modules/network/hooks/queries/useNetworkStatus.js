import { useQuery } from '@tanstack/react-query';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { NETWORK_STATUS, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

// eslint-disable-next-line import/prefer-default-export
export const useNetworkStatus = ({ config: customConfig = {}, options } = { }) => {
  const [currentApplication] = useCurrentApplication();
  const config = {
    baseUrl: currentApplication?.apis[0][METHOD] ?? currentApplication?.apis[0].rest,
    baseURL: currentApplication?.apis[0][METHOD] ?? currentApplication?.apis[0].rest,
    path: `/api/${API_VERSION}/network/status`,
    event: 'get.network.status',
    ...customConfig,
  };
  return useQuery(
    [NETWORK_STATUS, APPLICATION, METHOD, config],
    async () => API_METHOD[METHOD](config),
    {
      ...options,
    },
  );
};
