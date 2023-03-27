import * as localJSONStorage from 'src/utils/localJSONStorage';
import accounts from '@tests/constants/wallets';
import actionTypes from './actionTypes';
import bookmarksMiddleware from './middleware';

jest.mock('src/utils/localJSONStorage');

describe('Middleware: Bookmarks', () => {
  const next = jest.fn();
  const bookmarks = {
    LSK: [],
  };
  const store = {
    dispatch: jest.fn(),
    getState: () => ({
      bookmarks,
    }),
  };

  it('should pass the action', () => {
    const action = { type: 'ANY_ACTION' };
    bookmarksMiddleware(store)(next)(action);
    expect(next).toBeCalledWith(action);
  });

  it('should update localStorage with current bookmarks', () => {
    const actions = [
      {
        type: actionTypes.bookmarkAdded,
        data: { account: { ...accounts.genesis, title: 'genesis' } },
      },
      {
        type: actionTypes.bookmarkUpdated,
        data: { account: { ...accounts.genesis, title: 'genesis' } },
      },
      {
        type: actionTypes.bookmarkRemoved,
        data: { address: accounts.genesis.summary.address },
      },
    ];

    actions.forEach((action, index) => {
      bookmarksMiddleware(store)(next)(action);
      expect(localJSONStorage.setInStorage).toBeCalledTimes(index + 1);
    });
  });
});
