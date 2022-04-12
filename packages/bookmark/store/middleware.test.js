import * as localJSONStorage from '@common/utilities/localJSONStorage';
import accounts from '@tests/constants/accounts';
import actionTypes from './actionTypes';
import bookmarksMiddleware from './middleware';

jest.mock('@common/utilities/localJSONStorage');

describe('Middleware: Bookmarks', () => {
  const next = jest.fn();
  const bookmarks = {
    LSK: [],
    BTC: [],
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
    const actions = [{
      type: actionTypes.bookmarkAdded,
      data: { account: { ...accounts.genesis, title: 'genesis' } },
    }, {
      type: actionTypes.bookmarkUpdated,
      data: { account: { ...accounts.genesis, title: 'genesiss' } },
    }, {
      type: actionTypes.bookmarkRemoved,
      data: { address: accounts.genesis.summary.address },
    }];

    actions.forEach((action, index) => {
      bookmarksMiddleware(store)(next)(action);
      expect(localJSONStorage.setInStorage).toBeCalledTimes(index + 1);
    });
  });
});
