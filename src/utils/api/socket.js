import io from 'socket.io-client';

export class WS {
  client = null;

  create({ baseUrl }) {
    const uri = `${baseUrl.replace('http', 'ws')}`;
    this.client = io(
      uri,
      { transports: ['websocket'] },
    );
  }
}
export default new WS();
