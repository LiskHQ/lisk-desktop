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
    address: accounts.genesis.address,
    balance: accounts.genesis.balance,
    title: accounts.genesis.address,
    publicKey: accounts.genesis.publicKey,
  };
  const account2 = {
    address: accounts.delegate.address,
    balance: accounts.delegate.balance,
    title: accounts.genesis.address,
    publicKey: accounts.delegate.publicKey,
  };

  it(`should return accounts if action.type is ${actionTypes.followedAccountsRetrieved}`, () => {
    const state = { accounts: [] };
    const action = followedAccountsRetrieved([account, account2]);

    const changedState = followedAccounts(state, action);
    expect(changedState.accounts[0]).to.deep.equal(account);
    expect(changedState.accounts[1]).to.deep.equal(account2);
  });

  it(`should return accounts with added account if action.type is ${actionTypes.followedAccountAdded}`, () => {
    const account3 = {
      address: accounts['empty account'].address,
      balance: accounts['empty account'].balance,
      title: accounts['empty account'].address,
      publicKey: accounts['empty account'].publicKey,
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
      address: accounts.delegate.address,
      balance: accounts.delegate.balance,
      title: 'bob',
      publicKey: accounts.delegate.publicKey,
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
