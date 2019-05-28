import bookmarksSubscriber from './bookmarks';
import * as bookmarksUtils from '../../utils/bookmarks';
import accounts from '../../../test/constants/accounts';

jest.mock('../../utils/bookmarks');

describe('Subscriber: bookmarks(state)', () => {
  const account = {
    publicKey: accounts.genesis.publicKey,
    balance: accounts.genesis.balance,
    title: accounts.genesis.address,
  };
  const account2 = {
    publicKey: accounts.delegate.publicKey,
    balance: accounts.delegate.balance,
    title: accounts.delegate.address,
  };

  it('should save accounts in localStorage', () => {
    const state = { bookmarks: { LSK: [account, account2], BTC: [] } };
    const store = { getState: () => state };

    bookmarksSubscriber(store);
    expect(bookmarksUtils.setBookmarksInLocalStorage)
      .toBeCalledWith(state.bookmarks);
  });
});

