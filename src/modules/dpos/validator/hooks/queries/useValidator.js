import { useQuery } from '@tanstack/react-query';
import { VALIDATOR, APPLICATION } from 'src/const/queries';
import {
  METHOD,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

// eslint-disable-next-line import/prefer-default-export
export const useValidator = ({ config: customConfig = {}, options } = { }) => {
  const config = {
    url: `/api/${API_VERSION}/validator`,
    method: 'get',
    event: 'get.validator',
    ...customConfig,
  };
  return useQuery(
    [VALIDATOR, APPLICATION, METHOD, config],
    async () => API_METHOD[METHOD](config),
    {
      ...options,
    },
  );
};
