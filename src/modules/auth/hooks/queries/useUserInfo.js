import { useQuery } from '@tanstack/react-query';
import { AUTH, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

// eslint-disable-next-line import/prefer-default-export
export const useUserInfo = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/auth`,
    method: 'get',
    event: 'get.auth',
    ...customConfig,
  };
  return useQuery(
    [AUTH, APPLICATION, METHOD, config],
    async () => API_METHOD[METHOD](config),
    {
      ...options,
    },
  );
};
