import { expect } from 'chai';
import bookmarks from './bookmarks';
import {
  followedAccountAdded,
  followedAccountUpdated,
  followedAccountRemoved,
} from '../../actions/bookmarks';
import actionTypes from '../../constants/actions';
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

  it(`should return accounts with added account if action.type is ${actionTypes.followedAccountAdded}`, () => {
    const account3 = {
      address: accounts['empty account'].address,
      title: accounts['empty account'].address,
      publicKey: accounts['empty account'].publicKey,
    };

    const state = { LSK: [account, account2], BTC: [] };
    const action = followedAccountAdded({ account: account3, token: 'BTC' });
    const changedState = bookmarks(state, action);
    expect(changedState.LSK[0]).to.deep.equal(account);
    expect(changedState.LSK[1]).to.deep.equal(account2);
    expect(changedState.BTC[0]).to.include(account3);
  });


  it(`should return accounts with updated account if action.type is ${actionTypes.followedAccountUpdated}`, () => {
    const updatedAccount = {
      address: accounts.delegate.address,
      title: 'bob',
      publicKey: accounts.delegate.publicKey,
    };

    const state = { LSK: [account, account2], BTC: [] };
    const action = followedAccountUpdated({ account: updatedAccount });

    const changedState = bookmarks(state, action);

    expect(changedState.LSK[0]).to.deep.equal(account);
    expect(changedState.LSK[1]).to.deep.equal(updatedAccount);
  });


  it(`should return accounts without deleted account if action.type is ${actionTypes.followedAccountRemoved}`, () => {
    const state = { LSK: [account, account2] };
    const action = followedAccountRemoved({ address: account2.address, token: 'LSK' });

    const changedState = bookmarks(state, action);

    expect(changedState.LSK[0]).to.deep.equal(account);
    expect(changedState.LSK[1]).to.deep.equal(undefined);
  });
});

