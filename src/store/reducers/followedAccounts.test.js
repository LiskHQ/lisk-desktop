import { expect } from 'chai';
import followedAccounts from './followedAccounts';
import {
  followedAccountsRetrieved,
  followedAccountAdded,
  followedAccountUpdated,
  followedAccountRemoved,
} from '../../actions/followedAccounts';
import actionTypes from '../../constants/actions';
import accounts from '../../../test/constants/accounts';

describe('Reducer: followedAccounts(state, action)', () => {
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

  it(`should return accounts if action.type is ${actionTypes.followedAccountsRetrieved}`, () => {
    const state = { accounts: [] };

    let action = followedAccountsRetrieved(account);
    let changedState = followedAccounts(state, action);
    // make sure an array will be returned, regardless of input
    expect(changedState.accounts).to.deep.equal([account]);

    action = followedAccountsRetrieved([account, account2]);

    changedState = followedAccounts(state, action);
    expect(changedState.accounts[0]).to.deep.equal(account);
    expect(changedState.accounts[1]).to.deep.equal(account2);
  });

  it(`should return accounts with added account if action.type is ${actionTypes.followedAccountAdded}`, () => {
    const account3 = {
      publicKey: accounts['empty account'].publicKey,
      balance: accounts['empty account'].balance,
      title: accounts['empty account'].address,
    };

    const state = { accounts: [account, account2] };
    const action = followedAccountAdded(account3);

    const changedState = followedAccounts(state, action);

    expect(changedState.accounts[0]).to.deep.equal(account);
    expect(changedState.accounts[1]).to.deep.equal(account2);
    expect(changedState.accounts[2]).to.deep.equal(account3);
  });


  it(`should return accounts with updated account if action.type is ${actionTypes.followedAccountUpdated}`, () => {
    const updatedAccount = {
      publicKey: accounts.delegate.publicKey,
      balance: accounts.delegate.balance,
      title: 'bob',
    };

    const state = { accounts: [account, account2] };
    const action = followedAccountUpdated(updatedAccount);

    const changedState = followedAccounts(state, action);

    expect(changedState.accounts[0]).to.deep.equal(account);
    expect(changedState.accounts[1]).to.deep.equal(updatedAccount);
  });


  it(`should return accounts without deleted account if action.type is ${actionTypes.followedAccountRemoved}`, () => {
    const state = { accounts: [account, account2] };
    const action = followedAccountRemoved(account2);

    const changedState = followedAccounts(state, action);

    expect(changedState.accounts[0]).to.deep.equal(account);
    expect(changedState.accounts[1]).to.deep.equal(undefined);
  });
});

