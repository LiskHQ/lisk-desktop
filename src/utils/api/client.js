/* istanbul ignore file */
import io from 'socket.io-client';
import axios from 'axios';
import { /* METADATA_HOST, */ METHOD } from 'src/const/config';
import qs from 'querystring-es3';
import { removeKeysWithoutValue } from '../removeKeysWithoutValue';

export class Client {
  constructor(option) {
    if (option) {
      this.create(option);
    }
  }

  axiosConfig = {
    timeout: 10000,
    paramsSerializer: (params) => qs.stringify(removeKeysWithoutValue(params)),
  };

  socket = null;

  socketRPC = null;

  http = null;

  rpc = ({ event, params, data }) =>
    new Promise((resolve, reject) => {
      if (this.socketRPC.disconnected) {
        reject(new Error('socket not connected'));
        return;
      }
      const customParams = params && removeKeysWithoutValue(params);
      this.socketRPC.emit(
        'request',
        { method: event, params: customParams || data || {} },
        ({ result }) => {
          if (Object.keys(result).length || result.error) {
            return reject(result);
          }
          return resolve(result);
        }
      );
    });

  rest = (config) => this.http?.request({ ...this.http.defaults, ...config });

  call = ({ transformResult = async (data) => data, ...args }) =>
    this[METHOD](args).then(transformResult);

  create({ ws, http } = {}) {
    if (ws) {
      this.socket = io(`${ws}/blockchain`, { transports: ['websocket'] });
      this.socketRPC = io(`${ws}/rpc-v3`, { transports: ['websocket'] });
    }
    if (http) {
      const request = axios.create({
        ...this.axiosConfig,
        baseURL: http,
      });
      request.interceptors.response.use((res) => res.data);
      this.http = request;
    }
  }
}

export default new Client();

export const metaDataClient = new Client();
