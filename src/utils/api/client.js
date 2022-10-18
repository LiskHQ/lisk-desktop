/* istanbul ignore file */
import io from 'socket.io-client';
import axios from 'axios';
import { META_BASE_URL, METHOD } from 'src/const/config';

export class Client {
  constructor(option) {
    if (option) {
      this.create(option);
    }
  }

  axiosConfig = {
    timeout: 10000,
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
      this.socketRPC.emit(
        'request',
        { method: event, params: params || data || {} },
        (response) => {
          if (Object.keys(response).length && response.error) {
            return reject(response);
          }
          return resolve(response);
        }
      );
    });

  rest = (config) => this.http?.request({ ...this.http.defaults, ...config });

  call = ({ transformResult = async (data) => data, ...args }) =>
    this[METHOD](args).then(transformResult);

  create({ rpc, rest }) {
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

export const clientMetaData = new Client({ rest: META_BASE_URL });
export default new Client();
