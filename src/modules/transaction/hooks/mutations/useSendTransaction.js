/* istanbul ignore file */
import { useMutation } from '@tanstack/react-query';
import {
  METHOD,
  API_VERSION,
  API_METHOD,
} from 'src/const/config';

// eslint-disable-next-line import/prefer-default-export
export const useSendTransaction = (options) => useMutation(async ({ path, ...customConfig }) => {
  const config = {
    url: `/api/${API_VERSION}/transactions/`,
    method: 'post',
    event: 'get.network.status',
    ...customConfig,
  };
  return API_METHOD[METHOD]({
    path,
    config,
  });
},
options);
