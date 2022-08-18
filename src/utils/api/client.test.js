import client from './client';
// import { createServer } from 'http';
// import { Server } from 'socket.io';

jest.useRealTimers();

describe('demo', () => {
  // let server;
  // let io;

  // beforeAll((done) => {
  //   server = createServer((req, res) => {
  //     res.write('ok');
  //     res.end();
  //   });
  //   io = new Server(server);
  //   server.listen(() => {
  //     const port = server.address().port;
  //     socket.create({ baseUrl: `http://localhost:${port}` });
  //     // client.socket.on('connect', done);
  //     client.socket.on('connect', done);
  //   });
  // });
  //
  // afterAll(async () => {
  //   await server.close();
  //   await io.close();
  // });

  it.skip('should work', (done) => {
    client.socket.on('hello', (arg) => {
      expect(arg).toBe('world');
      done();
    });
    client.socket.emit('hello', 'world');
  });

  it.skip('should work (with ack)', (done) => {
    client.socket.on('hi', (cb) => {
      cb('hola');
    });
    client.socket.emit('hi', (arg) => {
      expect(arg).toBe('hola');
      done();
    });
  });
});
