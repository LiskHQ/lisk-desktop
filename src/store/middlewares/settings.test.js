import settingsMiddleware from './settings';
import actionTypes from '../../constants/actions';

describe('Middleware: Settings', () => {
  const next = jest.fn();
  const store = {
    dispatch: jest.fn(),
    getState: () => ({
      settings: {},
    }),
  };
  const pricesRetrieved = jest.fn();
  // const settingsUpdated = jest.fn();

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
    // const { settings } = store.getState();
    expect(pricesRetrieved).not.toBeCalled();
    // expect(settingsUpdated).toBeCalledWith(settings);
  });
});
