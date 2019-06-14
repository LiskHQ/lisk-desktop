import bookmarksMiddleware from './bookmarks';
import actionTypes from '../../constants/actions';
import accounts from '../../../test/constants/accounts';
import * as bookmarksUtils from '../../utils/bookmarks';

jest.mock('../../utils/bookmarks');

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
      data: { address: accounts.genesis.address },
    }];

    actions.map((action, index) => {
      bookmarksMiddleware(store)(next)(action);
      expect(bookmarksUtils.setBookmarksInLocalStorage).toBeCalledTimes(index + 1);
    });
  });
});
