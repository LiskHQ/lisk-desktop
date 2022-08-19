import { useQuery } from '@tanstack/react-query';
import { NETWORK_STATUS, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

// eslint-disable-next-line import/prefer-default-export
export const useNetworkStatus = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/network/status`,
    method: 'get',
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
