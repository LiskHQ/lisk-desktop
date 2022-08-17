import socket from 'src/utils/api/socket';
import rpc from './rpc';

jest.mock('src/utils/api/socket', () => ({
  client: {
    emit: jest.fn(),
    disconnected: false,
  },
  create: jest.fn(),
}));

describe('rpc', () => {
  afterEach(() => {
    socket.client.disconnected = false;
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('rpc should rejected on disconnected', () => {
    socket.client.disconnected = true;
    expect(rpc({
      event: 'get.data',
      params: {},
    })).rejects.toThrow('socket not connected');
  });

  it('rpc call should return data', () => {
    const res = { data: [] };
    socket.client.emit.mockImplementation((evtName, params, callback) => {
      callback(res);
    });
    expect(rpc({
      event: 'get.data',
      params: {},
    })).resolves.toBe(res);
  });

  it('rpc call should return error', () => {
    const res = { error: true, message: 'server error' };
    socket.client.emit.mockImplementation((evtName, params, callback) => {
      callback(res);
    });
    expect(rpc({
      event: 'get.data',
      params: {},
    })).rejects.toBe(res);
  });
});
