import io from 'socket.io-client';
import ws, { subscribe, unsubscribe } from './ws';

jest.mock('socket.io-client');

describe('ws', () => {
  const baseUrl = 'http://sample-service-url.com';

  it('Should call socket.emit', async () => {
    const requests = [{
      method: 'account.get',
      params: { address: '12L' },
    }];
    const emit = jest.fn().mockImplementation((evtName, params, callback) => {
      callback({ result: {} });
    });
    io.mockImplementation(() => ({ emit }));

    await ws({
      baseUrl,
      requests,
    });

    expect(io).toHaveBeenCalledWith(
      `${baseUrl}/rpc`,
      { transports: ['websocket'] },
    );
    expect(emit).toHaveBeenCalledWith(
      'request',
      [{ method: 'account.get', params: { address: '12L' } }],
      expect.anything(), // callback function
    );
  });

  it('should return a response object for a single request', async () => {
    const resultObject = { message: 'ok' };

    const emit = jest.fn().mockImplementation((evtName, params, callback) => {
      callback({ result: resultObject });
    });
    io.mockImplementation(() => ({ emit }));
    const responseObject = await ws({});

    expect(responseObject).toEqual(resultObject);
  });

  it('should return a response object for an array of requests', async () => {
    const resultArray = ['1', '2', '3'];

    const emit = jest.fn().mockImplementation((evtName, params, callback) => {
      callback({ result: resultArray });
    });
    io.mockImplementation(() => ({ emit }));
    const responseArray = await ws({});

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
