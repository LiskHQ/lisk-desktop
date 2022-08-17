// import { rest } from 'src/utils/api';
import axios from 'axios';
import { rpc } from 'src/utils/api';

const request = axios.create(); // todo axios instance need to be singleton
request.interceptors.response.use((res) => res.data);
export const METHOD = 'rest';
export const LIMIT = 20;
export const API_VERSION = 'v3';
export const API_METHOD = { rpc, rest: ({ path, method = 'get', ...config }) => request[method](path, config) };
