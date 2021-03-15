import { expect } from 'chai';
import {
  bookmarkAdded,
  bookmarkUpdated,
  bookmarkRemoved,
} from 'actions';
import bookmarks from './bookmarks';
import actionTypes from 'constants';
import accounts from '../../../test/constants/accounts';

describe('Reducer: bookmarks(state, action)', () => {
  const account = {
    address: accounts.genesis.address,
    title: accounts.genesis.address,
    publicKey: accounts.genesis.publicKey,
  };
  const account2 = {
    address: accounts.delegate.address,
    title: accounts.genesis.address,
    publicKey: accounts.delegate.publicKey,
  };

  it(`should return accounts with added account if action.type is ${actionTypes.bookmarkAdded}`, () => {
    const account3 = {
      address: accounts.empty_account.address,
      title: accounts.empty_account.address,
      publicKey: accounts.empty_account.publicKey,
    };

    const state = { LSK: [account, account2], BTC: [] };
    const action = bookmarkAdded({ account: account3, token: 'BTC' });
    const changedState = bookmarks(state, action);
    expect(changedState.LSK[0]).to.deep.equal(account);
    expect(changedState.LSK[1]).to.deep.equal(account2);
    expect(changedState.BTC[0]).to.include(account3);
  });

  it(`should return accounts with added account and trimmed title if action.type is ${actionTypes.bookmarkAdded}`, () => {
    const account3 = {
      address: accounts.empty_account.address,
      title: accounts.empty_account.address,
      publicKey: accounts.empty_account.publicKey,
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
    expect(changedState.LSK[0]).to.deep.equal(account);
    expect(changedState.LSK[1]).to.deep.equal(account2);
    expect(changedState.BTC[0]).to.include(account3);
  });


  it(`should return accounts with updated account if action.type is ${actionTypes.bookmarkUpdated}`, () => {
    const updatedAccount = {
      address: accounts.delegate.address,
      title: 'bob',
      publicKey: accounts.delegate.publicKey,
    };

    const state = { LSK: [account, account2], BTC: [] };
    const action = bookmarkUpdated({ account: updatedAccount });

    const changedState = bookmarks(state, action);

    expect(changedState.LSK[0]).to.deep.equal(account);
    expect(changedState.LSK[1]).to.deep.equal(updatedAccount);
  });

  it(`should return accounts with updated account and trimmed title if action.type is ${actionTypes.bookmarkUpdated}`, () => {
    const updatedAccount = {
      address: accounts.delegate.address,
      title: 'bob',
      publicKey: accounts.delegate.publicKey,
    };

    const state = { LSK: [account, account2], BTC: [] };
    const action = bookmarkUpdated({
      account: {
        ...updatedAccount,
        title: '     bob     ',
      },
    });

    const changedState = bookmarks(state, action);

    expect(changedState.LSK[0]).to.deep.equal(account);
    expect(changedState.LSK[1]).to.deep.equal(updatedAccount);
  });


  it(`should return accounts without deleted account if action.type is ${actionTypes.bookmarkRemoved}`, () => {
    const state = { LSK: [account, account2] };
    const action = bookmarkRemoved({ address: account2.address, token: 'LSK' });

    const changedState = bookmarks(state, action);

    expect(changedState.LSK[0]).to.deep.equal(account);
    expect(changedState.LSK[1]).to.deep.equal(undefined);
  });
});
