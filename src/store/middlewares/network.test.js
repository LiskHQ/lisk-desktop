import Lisk from '@liskhq/lisk-client';
import actionTypes from '../../constants/actions';
import networkMiddleware from './network';

describe('actions: network.lsk', () => {
  const next = jest.fn();
  const otherActions = {
    type: 'ANY',
  };
  const nodeDefinedAction = {
    type: actionTypes.nodeDefined,
    data: {
      name: 'mainnet',
      network: {
        code: 0,
        networkIdentifier: 'sample',
        nodeUrl: 'http://myNode.com',
      },
    },
  };

  it('should only pass all actions', () => {
    const store = {
      dispatch: jest.fn(),
    };
    networkMiddleware(store)(next)(otherActions);
    expect(next.mock.calls.length).toBe(1);
  });

  it.skip('should dispatch networkSet if node is available', async () => {
    const store = {
      dispatch: jest.fn(),
    };
    const APIClientBackup = Lisk.APIClient;
    Lisk.APIClient = class MockAPIClient {
      constructor() {
        this.node = {
          getConstants: jest.fn()
            .mockImplementation(() => Promise.resolve({
              nethash: 'sample_net_hash',
              networkId: 'sample_network_id',
            })),
        };
      }
    };
    Lisk.APIClient.constants = APIClientBackup.constants;

    await networkMiddleware(store)(next)(nodeDefinedAction);
    expect(store.dispatch).toHaveBeenCalled();
    expect(next.mock.calls.length).toBe(2);
  });

  it.skip('should dispatch networkSet if node is not available', async () => {
    const store = {
      dispatch: jest.fn(),
    };
    const APIClientBackup = Lisk.APIClient;
    Lisk.APIClient = class MockAPIClient {
      constructor() {
        this.node = {
          getConstants: jest.fn()
            .mockImplementation(() => Promise.reject(new Error('sample message'))),
        };
      }
    };
    Lisk.APIClient.constants = APIClientBackup.constants;

    await networkMiddleware(store)(next)(nodeDefinedAction);
    expect(store.dispatch).not.toHaveBeenCalled();
    expect(next.mock.calls.length).toBe(3);
  });
});
