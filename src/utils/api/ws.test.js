import io from 'socket.io-client';
import ws from './ws';

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
    expect(io.mock.calls[0][0]).toContain(baseUrl);
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit.mock.calls[0][0]).toEqual('request');
    expect(emit.mock.calls[0][1]).toEqual(requests);
    expect(typeof emit.mock.calls[0][2]).toEqual('function');
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
});
