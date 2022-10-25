/* istanbul ignore file */
import io from 'socket.io-client';
import axios from 'axios';
import { METHOD } from 'src/const/config';
import qs from 'qs';
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
      const customParams = params && removeKeysWithoutValue(params )
      this.socket.emit(
        'request',
        { method: event, params: customParams || data || {} },
        (response) => {
          if (Object.keys(response).length && response.error) {
            return reject(response);
          }
          return resolve(response);
        }
      );
    });

  rest = (config) => this.http?.request({ ...this.http.defaults, ...config });

  call = ({ transformResult = async (data) => data, ...args }) => this[METHOD](args).then(transformResult);

  create({ rpc, rest } = {}) {
    if (rpc) {
      this.socket = io(rpc, { transports: ['websocket'], path: '/blockchain' });
      this.socketRPC = io(rpc, { transports: ['websocket'], path: '/rpc-v3' });
    }
    if (rest) {
      const request = axios.create({
        ...this.axiosConfig,
        baseURL: rest,
      });
      request.interceptors.response.use((res) => res.data);
      this.http = request;
    }
  }
}

export default new Client();
