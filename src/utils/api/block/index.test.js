import * as block from './index';
import { subscribe, unsubscribe } from '../ws';

jest.mock('../ws');

describe('Block api module', () => {
  it('Should call ws subscribe with parameters', () => {
    const fn = () => {};
    const serviceUrl = 'http://sample-service-url.com';
    const connection = {};
    subscribe.mockImplementation(() => connection);
    const returnedObject = block.blockSubscribe({ serviceUrl }, fn, fn, fn);

    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith(serviceUrl, 'blocks/change', fn, fn, fn);
    expect(returnedObject).toEqual({
      'blocks/change': {
        forcedClosing: false,
        connection,
      },
    });
  });

  it('Should call ws unsubscribe with parameters', () => {
    const socketConnections = {
      'blocks/change': {
        forcedClosing: false,
        connection: {},
      },
    };
    const returnedObject = block.blockUnsubscribe({ socketConnections });
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(unsubscribe).toHaveBeenCalledWith('blocks/change', socketConnections);
    expect(returnedObject).toEqual({});
  });
});
