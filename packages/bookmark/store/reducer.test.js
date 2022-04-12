import {
  bookmarkAdded, bookmarkUpdated, bookmarkRemoved,
} from '@common/store/actions';
import actionTypes from './actionTypes';
import accounts from '@tests/constants/accounts';
import bookmarks from './reducer';

// eslint-disable-next-line camelcase
const { genesis, delegate, empty_account } = accounts;

describe('Reducer: bookmarks(state, action)', () => {
  const account = {
    address: genesis.summary.address,
    title: genesis.summary.address,
    publicKey: genesis.summary.publicKey,
  };
  const account2 = {
    address: delegate.summary.address,
    title: genesis.summary.address,
    publicKey: delegate.summary.publicKey,
  };

  it(`should return accounts with added account if action.type is ${actionTypes.bookmarkAdded}`, () => {
    const account3 = {
      address: empty_account.summary.address,
      title: empty_account.summary.address,
      publicKey: empty_account.summary.publicKey,
    };

    const state = { LSK: [account, account2], BTC: [] };
    const action = bookmarkAdded({ account: account3, token: 'BTC' });
    const changedState = bookmarks(state, action);
    expect(changedState.LSK[0]).toEqual(account);
    expect(changedState.LSK[1]).toEqual(account2);
    expect(changedState.BTC[0]).toMatchObject(account3);
  });

  it(`should return accounts with added account and trimmed title if action.type is ${actionTypes.bookmarkAdded}`, () => {
    const account3 = {
      address: empty_account.summary.address,
      title: empty_account.summary.address,
      publicKey: empty_account.summary.publicKey,
    };

    const state = { LSK: [account, account2], BTC: [] };
    const action = bookmarkAdded({
      account: {
        ...account3,
        title: `     ${account3.title}    `,
      },
      token: 'BTC',
    });
    const changedState = bookmarks(state, action);
    expect(changedState.LSK[0]).toEqual(account);
    expect(changedState.LSK[1]).toEqual(account2);
    expect(changedState.BTC[0]).toMatchObject(account3);
  });

  it(`should return accounts with updated account if action.type is ${actionTypes.bookmarkUpdated}`, () => {
    const updatedAccount = {
      address: delegate.summary.address,
      title: 'bob',
      publicKey: delegate.summary.publicKey,
    };

    const state = { LSK: [account, account2], BTC: [] };
    const action = bookmarkUpdated({ account: updatedAccount });

    const changedState = bookmarks(state, action);

    expect(changedState.LSK[0]).toEqual(account);
    expect(changedState.LSK[1]).toEqual(updatedAccount);
  });

  it(`should return accounts with updated account and trimmed title if action.type is ${actionTypes.bookmarkUpdated}`, () => {
    const updatedAccount = {
      address: delegate.summary.address,
      title: 'bob',
      publicKey: delegate.summary.publicKey,
    };

    const state = { LSK: [account, account2], BTC: [] };
    const action = bookmarkUpdated({
      account: {
        ...updatedAccount,
        title: '     bob     ',
      },
    });

    const changedState = bookmarks(state, action);

    expect(changedState.LSK[0]).toEqual(account);
    expect(changedState.LSK[1]).toEqual(updatedAccount);
  });

  it(`should return accounts without deleted account if action.type is ${actionTypes.bookmarkRemoved}`, () => {
    const state = { LSK: [account, account2] };
    const action = bookmarkRemoved({ address: account2.address, token: 'LSK' });

    const changedState = bookmarks(state, action);

    expect(changedState.LSK[0]).toEqual(account);
    expect(changedState.LSK[1]).toEqual(undefined);
  });

  it('should return validated bookmarks if action.type = actionType.bookmarksRetrieved', () => {
    const action = {
      type: actionTypes.bookmarksRetrieved,
      data: { LSK: [account, account2], BTC: [] },
    };

    let state;

    const changedState = bookmarks(state, action);
    expect(changedState).toEqual(action.data);
  });
});
