import { service, transactions } from 'actions';
import actionTypes from 'constants';
import settingsMiddleware from './settings';

jest.mock('../../actions/service');
jest.mock('../../actions/settings');
jest.mock('../../actions/transactions');

describe('Middleware: Settings', () => {
  const next = jest.fn();
  const store = {
    dispatch: jest.fn(),
    getState: () => ({
      settings: {
        token: { },
      },
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
      };

      settingsMiddleware(store)(next)(action);
      expect(service.pricesRetrieved).toBeCalled();
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
      expect(service.pricesRetrieved).not.toBeCalled();
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
      expect(transactions.emptyTransactionsData).toBeCalled();
    });
  });
});
