import socket from './socket';
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
  //     // socket.client.on('connect', done);
  //     socket.client.on('connect', done);
  //   });
  // });
  //
  // afterAll(async () => {
  //   await server.close();
  //   await io.close();
  // });

  it.skip('should work', (done) => {
    socket.client.on('hello', (arg) => {
      expect(arg).toBe('world');
      done();
    });
    socket.client.emit('hello', 'world');
  });

  it.skip('should work (with ack)', (done) => {
    socket.client.on('hi', (cb) => {
      cb('hola');
    });
    socket.client.emit('hi', (arg) => {
      expect(arg).toBe('hola');
      done();
    });
  });
});
