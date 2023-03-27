import io from 'socket.io-client';
import ws, { subscribe, unsubscribe, subscribeConnections } from './ws';

jest.mock('socket.io-client');

describe('Web socket', () => {
  const baseUrl = 'http://sample-service-url.com';
  const wsURI = 'ws://sample-service-url.com/rpc-v3';

  describe('ws', () => {
    it('Should call socket.emit', async () => {
      const requests = [
        {
          method: 'account.get',
          params: { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99' },
        },
      ];
      const emit = jest.fn().mockImplementation((evtName, params, callback) => {
        callback([]);
      });
      io.mockImplementation(() => ({ emit }));

      await ws({
        baseUrl,
        requests,
      });

      expect(io).toHaveBeenCalledWith(wsURI, { transports: ['websocket'] });
      expect(emit).toHaveBeenCalledWith(
        'request',
        [
          {
            method: 'account.get',
            params: { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y99' },
          },
        ],
        expect.anything() // callback function
      );
    });

    it('should return a response object for a single request', async () => {
      const wsResult = [
        {
          result: {
            data: [{ message: 'ok' }],
            meta: { count: 1, offset: 0 },
          },
        },
      ];

      const normalizedResult = {
        data: [{ message: 'ok' }],
        meta: { count: 1, offset: 0 },
      };

      const emit = jest.fn().mockImplementation((evtName, params, callback) => {
        callback(wsResult);
      });
      io.mockImplementation(() => ({ emit }));
      const responseObject = await ws({
        baseUrl,
      });

      expect(responseObject).toEqual(normalizedResult);
    });

    it('should return a response object for an array of requests', async () => {
      const wsResult = [
        {
          result: {
            data: [{ message: 'ok' }],
            meta: { count: 1, offset: 0 },
          },
        },
        {
          result: {
            data: [{ message: 'ok' }],
            meta: { count: 1, offset: 0 },
          },
        },
      ];

      const normalizedResult = {
        data: [{ message: 'ok' }, { message: 'ok' }],
        meta: { count: 2, offset: 0 },
      };

      const emit = jest.fn().mockImplementation((evtName, params, callback) => {
        callback(wsResult);
      });
      io.mockImplementation(() => ({ emit }));
      const responseArray = await ws({
        baseUrl,
      });

      expect(responseArray).toEqual(normalizedResult);
    });

    it('should return an error', async () => {
      const error = { message: 'error' };
      const emit = jest.fn().mockImplementation((evtName, params, callback) => {
        callback({ error });
      });
      io.mockImplementation(() => ({ emit }));

      await expect(
        ws({
          baseUrl,
        })
      ).rejects.toEqual(error);
    });
  });

  describe('subscribe&unsubscribe', () => {
    const on = jest.fn();
    const close = jest.fn();
    const event = 'blocks/change';

    it('should subscribe correctly', () => {
      io.mockImplementation(() => ({ on, close }));
      const fn = () => {};
      subscribe(baseUrl, event, fn, fn, fn);

      expect(on).toHaveBeenCalledTimes(3);
      expect(on).toHaveBeenNthCalledWith(1, event, fn);
      expect(on).toHaveBeenNthCalledWith(2, 'reconnect', fn);
      expect(on).toHaveBeenNthCalledWith(3, 'disconnect', expect.any(Function));
      expect(subscribeConnections).toEqual({
        [event]: {
          connection: { on, close },
          forcedClosing: false,
        },
      });
    });

    it('should unsubscribe correctly', () => {
      unsubscribe(event);

      expect(close).toHaveBeenCalledTimes(1);
      expect(subscribeConnections).toEqual({});
    });
  });
});
