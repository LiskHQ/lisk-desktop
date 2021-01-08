import io from 'socket.io-client';
import ws, { subscribe, unsubscribe } from './ws';

jest.mock('socket.io-client');

describe('Web socket', () => {
  const baseUrl = 'http://sample-service-url.com';

  describe('ws', () => {
    it('Should call socket.emit', async () => {
      const requests = [{
        method: 'account.get',
        params: { address: '12L' },
      }];
      const emit = jest.fn().mockImplementation((evtName, params, callback) => {
        callback([]);
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
      const responseObject = await ws({});

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
      const responseArray = await ws({});

      expect(responseArray).toEqual(normalizedResult);
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

  describe('subscribe', () => {
    it('should subscribe correctly', () => {
      const on = jest.fn();
      io.mockImplementation(() => ({ on }));
      const fn = () => {};
      const event = 'blocks/change';
      subscribe(baseUrl, event, fn, fn, fn);

      expect(on).toHaveBeenCalledTimes(3);
      expect(on).toHaveBeenNthCalledWith(1, event, fn);
      expect(on).toHaveBeenNthCalledWith(2, 'reconnect', fn);
      expect(on).toHaveBeenNthCalledWith(3, 'disconnect', expect.any(Function));
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe correctly', () => {
      const close = jest.fn();
      const event = 'blocks/change';
      const connection = { close };
      const connections = { [event]: { connection, forcedClosing: false } };
      unsubscribe(event, connections);

      expect(close).toHaveBeenCalledTimes(1);
    });
  });
});
