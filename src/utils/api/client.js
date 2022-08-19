/* istanbul ignore file */
import io from 'socket.io-client';
import axios from 'axios';

export class Client {
  socket = null;

  axiosConfig = {
    timeout: 10000,
  }

  http = null

  create({ rpc, rest }) {
    this.socket = io(
      rpc,
      { transports: ['websocket'] },
    );
    const request = axios.create({
      ...this.axiosConfig,
      baseURL: rest,
    });
    request.interceptors.response.use((res) => res.data);
    this.http = request;
  }
}
export default new Client();
