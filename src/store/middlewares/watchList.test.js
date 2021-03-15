import actionTypes from 'constants';
import middleware from './watchList';
import { setInStorage } from '../../utils/localJSONStorage';

jest.mock('../../utils/localJSONStorage', () => ({ setInStorage: jest.fn() }));

describe('Middleware: WatchList', () => {
  const next = jest.fn();
  const watchList = ['1L'];
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
    const actions = [{ type: actionTypes.addedToWatchList, data: { address: '2L' } },
      { type: actionTypes.removedFromWatchList, data: { address: '3L' } }];
    actions.map(action => middleware(store)(next)(action));

    expect(setInStorage).toHaveBeenCalledTimes(actions.length);
  });
});
