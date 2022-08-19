import { useMutation } from '@tanstack/react-query';
import {
  METHOD,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

// eslint-disable-next-line import/prefer-default-export
export const useSendTransaction = ({
  config: customConfig = {},
  options,
} = { }) => useMutation(async (data) => {
  const config = {
    url: `/api/${API_VERSION}/transactions/`,
    method: 'post',
    event: 'get.network.status',
    ...customConfig,
    data,
  };
  return API_METHOD[METHOD](config);
},
options);
