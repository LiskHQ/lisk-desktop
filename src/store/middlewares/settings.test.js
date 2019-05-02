import settingsMiddleware from './settings';
import actionTypes from '../../constants/actions';
import * as settings from '../../actions/settings';
import * as service from '../../actions/service';

jest.mock('../../actions/service');
jest.mock('../../actions/settings');

describe('Middleware: Settings', () => {
  const next = jest.fn();
  const store = {
    dispatch: jest.fn(),
    getState: () => ({
      settings: {},
    }),
  };

  it('should pass the action', () => {
    const action = { type: 'ANY_ACTION' };
    settingsMiddleware(store)(next)(action);
    expect(next).toBeCalledWith(action);
  });

  it('should dispatch settingsUpdated', () => {
    const action = {
      type: actionTypes.settingsUpdateToken,
      data: {
        test: true,
      },
    };

    settingsMiddleware(store)(next)(action);
    expect(service.pricesRetrieved).not.toBeCalled();
    expect(settings.settingsUpdated).toBeCalledWith(store.getState().settings);
  });

  it('should dispatch pricesRetrieved and settingsUpdated', () => {
    const action = {
      type: actionTypes.settingsUpdateToken,
      data: {
        token: true,
      },
    };

    settingsMiddleware(store)(next)(action);
    expect(service.pricesRetrieved).toBeCalled();
    expect(settings.settingsUpdated).toBeCalledWith(store.getState().settings);
  });
});
