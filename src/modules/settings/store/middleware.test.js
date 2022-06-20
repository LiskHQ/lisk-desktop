import { pricesRetrieved, settingsUpdated } from '@common/store/actions';
import networkActionTypes from '@network/store/actionTypes';
import * as storageUtils from 'src/utils/localJSONStorage';
import actionTypes from './actionTypes';
import settingsMiddleware from './middleware';

jest.mock('@common/store/actions');
jest.mock('@transaction/store/actions');
jest.mock('src/utils/localJSONStorage', () => ({
  setInStorage: jest.fn(),
}));
jest.mock('./actions');

describe('Middleware: Settings', () => {
  const next = jest.fn();
  const token = {
    active: 'LSK',
  };
  const store = {
    dispatch: jest.fn(),
    getState: () => ({ token }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic behavior', () => {
    it('should pass the action', () => {
      const action = { type: 'ANY_ACTION' };
      settingsMiddleware(store)(next)(action);
      expect(next).toBeCalledWith(action);
    });
  });

  describe('on networkConfigSet', () => {
    it('should dispatch pricesRetrieved', () => {
      const action = {
        type: networkActionTypes.networkConfigSet,
        data: {
          name: 'customNode',
          networks: {
            LSK: {
              serviceUrl: 'http://test.io',
            },
          },
        },
      };

      settingsMiddleware(store)(next)(action);
      expect(pricesRetrieved).toBeCalled();
      expect(settingsUpdated).toBeCalled();
    });
  });

  describe('on settingsUpdated', () => {
    it('should not dispatch pricesRetrieved', () => {
      const action = {
        type: actionTypes.settingsUpdated,
        data: {
          test: true,
        },
      };

      settingsMiddleware(store)(next)(action);
      expect(pricesRetrieved).not.toBeCalled();
    });

    it('should call setInStorage', () => {
      const action = {
        type: actionTypes.settingsUpdated,
      };

      settingsMiddleware(store)(next)(action);
      expect(storageUtils.setInStorage).toHaveBeenCalledWith('token', token);
    });
  });
});
