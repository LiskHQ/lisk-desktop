import { rpc } from 'src/utils/api';
import client from 'src/utils/api/client';

export const METHOD = 'rest';
export const LIMIT = 20;
export const API_VERSION = 'v3';
export const API_METHOD = {
  rpc,
  rest: (config) => client.http?.request({ ...client.http.defaults, ...config }),
};
