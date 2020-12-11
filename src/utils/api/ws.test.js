import io from 'socket.io-client';
import ws, { subscribe, unsubscribe } from './ws';

jest.mock('socket.io-client');

describe('ws', () => {
  const baseUrl = 'http://sample-service-url.com';

  it('should return a promise and call emit with parameters', async () => {
    const requests = [{
      method: 'account.get',
      params: { address: '12L' },
    }];
    const emit = jest.fn().mockImplementation((evtName, params, callback) => {
      callback({ result: {} });
    });
    io.mockImplementation(() => ({ emit }));

    const wsPromise = ws({
      baseUrl,
      requests,
    });
    await wsPromise;

    expect(typeof wsPromise.then).toEqual('function');
    expect(typeof wsPromise.catch).toEqual('function');
    expect(io).toHaveBeenCalledWith(`${baseUrl}/rpc`, { transports: ['websocket'] });
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith('request', requests, expect.any(Function));
  });

  it('should return a response', async () => {
    const resultObject = { message: 'ok' };
    const resultArray = ['1', '2', '3'];

    let emit = jest.fn().mockImplementation((evtName, params, callback) => {
      callback({ result: resultObject });
    });
    io.mockImplementation(() => ({ emit }));
    const responseObject = await ws({});

    emit = jest.fn().mockImplementation((evtName, params, callback) => {
      callback({ result: resultArray });
    });
    io.mockImplementation(() => ({ emit }));
    const responseArray = await ws({});

    expect(responseObject).toEqual(resultObject);
    expect(responseArray).toEqual(resultArray);
  });

  it('should return an error', async () => {
    const error = { message: 'error' };
    const emit = jest.fn().mockImplementation((evtName, params, callback) => {
      callback({ error });
    });
    io.mockImplementation(() => ({ emit }));
    await expect(ws({})).rejects.toEqual(error);
  });

  it('should subscribe correctly', () => {
    const on = jest.fn();
    io.connect = () => ({ on });
    const fn = () => {};
    const event = 'blocks/change';
    subscribe(baseUrl, event, fn, fn, fn);

    expect(on).toHaveBeenCalledTimes(3);
    expect(on).toHaveBeenNthCalledWith(1, event, fn);
    expect(on).toHaveBeenNthCalledWith(2, 'reconnect', fn);
    expect(on).toHaveBeenNthCalledWith(3, 'disconnect', expect.any(Function));
  });

  it('should unsubscribe correctly', () => {
    const fn = () => {};
    const close = jest.fn();
    io.connect = () => ({ on: fn, close });
    const event = 'blocks/change';
    subscribe(baseUrl, event, fn, fn, fn);
    unsubscribe(event);

    expect(close).toHaveBeenCalledTimes(1);
  });
});
