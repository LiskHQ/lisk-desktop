import { setInStorage } from '@common/utilities/localJSONStorage';
import actionTypes from '../actions/actionTypes';
import middleware from './watchList';

jest.mock('@common/utilities/localJSONStorage', () => ({ setInStorage: jest.fn() }));

describe('Middleware: WatchList', () => {
  const next = jest.fn();
  const watchList = ['lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11'];
  const store = {
    dispatch: jest.fn(),
    getState: () => ({
      watchList,
    }),
  };

  it('should pass the action', () => {
    const action = { type: 'ANY_ACTION' };
    middleware(store)(next)(action);

    expect(next).toBeCalledWith(action);
  });

  it('should update localStorage with current watchlist', () => {
    const actions = [{ type: actionTypes.addedToWatchList, data: { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12' } },
      { type: actionTypes.removedFromWatchList, data: { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13' } }];
    actions.map(action => middleware(store)(next)(action));

    expect(setInStorage).toHaveBeenCalledTimes(actions.length);
  });
});
