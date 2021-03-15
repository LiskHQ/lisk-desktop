import { networkConfigSet } from '@actions';
import actionTypes from '@constants';
import middleware from './network';

jest.mock('../../actions/network', () => ({ networkConfigSet: jest.fn() }));

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
});
