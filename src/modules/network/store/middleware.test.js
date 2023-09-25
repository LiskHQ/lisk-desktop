import { networkConfigSet } from './action';
import actionTypes from './actionTypes';
import middleware from './middleware';

jest.mock('@auth/store/action', () => ({
  login: jest.fn(),
}));

jest.mock('./action', () => ({
  networkConfigSet: jest.fn(),
}));

describe('Middleware: Network', () => {
  const next = jest.fn();
  const store = { dispatch: jest.fn(), getState: () => {} };

  it('should pass the action', () => {
    const action = { type: 'ANY_ACTION' };
    middleware(store)(next)(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should call networkConfigSet action if action type is networkSelected', async () => {
    const action = { type: actionTypes.networkSelected, data: {} };
    await middleware(store)(next)(action);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(networkConfigSet).toHaveBeenCalledWith(action.data);
  });

  it('networkConfigSet action to perform auto login', async () => {
    const action = { type: actionTypes.networkConfigSet, data: {} };
    await middleware(store)(next)(action);
    expect(store.dispatch).toHaveBeenCalled();
  });
  it('networkConfigSet action to not perform auto login', async () => {
    const action = { type: actionTypes.networkConfigSet, data: {} };
    await middleware(store)(next)(action);
    expect(store.dispatch).toHaveBeenCalled();
  });
});
