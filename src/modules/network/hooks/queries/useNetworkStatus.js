import { useQuery } from '@tanstack/react-query';
import { useCurrentApplication } from '@blockchainApplication/manage/hooks';
import { NETWORK_STATUS, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  LIMIT as limit,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

// eslint-disable-next-line import/prefer-default-export
export const useNetworkStatus = ({ config: customConfig = {}, options } = { }) => {
  const [currentApplication] = useCurrentApplication();
  const config = {
    baseUrl: currentApplication?.node[0][METHOD] ?? currentApplication?.node[0].rest,
    path: `/api/${API_VERSION}/network/status/`,
    event: 'get.network.status',
    ...customConfig,
    params: { limit, ...customConfig.params },
  };
  return useQuery(
    [NETWORK_STATUS, APPLICATION, METHOD, config],
    async () => API_METHOD[METHOD](config),
    {
      ...options,
      select: ({ data }) => options?.select(data) ?? data,
    },
  );
};
