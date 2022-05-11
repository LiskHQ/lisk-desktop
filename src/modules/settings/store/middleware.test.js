import { pricesRetrieved, emptyTransactionsData, settingsUpdated } from './actions';
import actionTypes from './actionTypes';
import settingsMiddleware from './middleware';

jest.mock('@common/store/actions/service');
jest.mock('@transaction/store/actions');
jest.mock('./middleware');
jest.mock('./actions');

describe('Middleware: Settings', () => {
  const next = jest.fn();
  const store = {
    dispatch: jest.fn(),
    getState: () => ({
      settings: {},
      token: {},
    }),
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
        type: actionTypes.networkConfigSet,
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

    it('should dispatch pricesRetrieved', () => {
      const action = {
        type: actionTypes.settingsUpdated,
        data: {
          token: {
            active: 'LSK',
          },
        },
      };

      settingsMiddleware(store)(next)(action);
      expect(emptyTransactionsData).toBeCalled();
    });
  });
});
