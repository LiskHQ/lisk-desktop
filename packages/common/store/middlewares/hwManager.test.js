import { toast } from 'react-toastify';
import { subscribeToDeviceConnected, subscribeToDeviceDisconnected } from '@wallet/utils/hwManager';
import { addSearchParamsToUrl } from 'src/utils/searchParams';
import accounts from '@tests/constants/wallets';
import actionTypes from '../actions/actionTypes';
import hwManagerMiddleware from './hwManager';

jest.mock('@wallet/utils/hwManager', () => ({
  subscribeToDeviceConnected: jest.fn().mockImplementation((fn) => fn({ model: 'testHW' })),
  subscribeToDeviceDisconnected: jest.fn().mockImplementation((fn) => fn({ model: 'testHW' })),
}));

jest.mock('@screens/router/searchParams', () => ({
  addSearchParamsToUrl: jest.fn(),
}));

describe('Middleware: hwManager', () => {
  const next = jest.fn();
  const store = {
    dispatch: jest.fn(),
    getState: () => ({
      settings: { token: { active: 'LSK' } },
      account: {
        info: {
          LSK: {
            ...accounts.genesis,
            address: accounts.genesis.summary.address,
          },
        },
        hwInfo: {
          deviceId: 1,
          deviceModel: 'testHW',
        },
      },
    }),
  };

  it('should pass the action', () => {
    const action = { type: 'ANY_ACTION' };
    hwManagerMiddleware(store)(next)(action);
    expect(next).toBeCalledWith(action);
  });

  it('should add subscribers and call them properly', () => {
    const action = { type: actionTypes.storeCreated };
    window.ipc = {};
    jest.spyOn(toast, 'success');
    jest.spyOn(toast, 'error');

    hwManagerMiddleware(store)(next)(action);

    expect(subscribeToDeviceConnected).toBeCalledWith(expect.any(Function));
    expect(toast.success).toBeCalledWith('testHW connected');

    expect(subscribeToDeviceDisconnected).toBeCalledWith(expect.any(Function));
    expect(store.dispatch).toBeCalledWith({ type: actionTypes.accountLoggedOut });
    expect(toast.error).toBeCalledWith('testHW disconnected');
    expect(addSearchParamsToUrl).toBeCalledWith(expect.any(Object), { modal: 'deviceDisconnectDialog', model: 'testHW' });
  });
});
