import client from 'src/utils/api/client';
import rpc from './rpc';

jest.mock('src/utils/api/client', () => ({
  socket: {
    emit: jest.fn(),
    disconnected: false,
  },
  http: {
    request: jest.fn(),
  },
  create: jest.fn(),
}));

describe('rpc', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('rpc should rejected on disconnected', () => {
    expect(
      rpc({
        event: 'get.data',
        params: {},
      })
    ).rejects.toThrow('socket not connected');
  });

  it.skip('rpc call should return data', () => {
    const res = { data: [] };
    client.socket.emit.mockImplementation((evtName, params, callback) => {
      callback(res);
    });
    expect(
      rpc({
        event: 'get.data',
        params: {},
      })
    ).resolves.toBe(res);
  });

  it.skip('rpc call should return error', () => {
    const res = { error: true, message: 'server error' };
    client.socket.emit.mockImplementation((evtName, params, callback) => {
      callback(res);
    });
    expect(
      rpc({
        event: 'get.data',
        params: {},
      })
    ).rejects.toBe(res);
  });
});
