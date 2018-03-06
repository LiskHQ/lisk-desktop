import { expect } from 'chai';
import savedAccounts from './savedAccounts';
import actionTypes from '../../constants/actions';
import accounts from '../../../test/constants/accounts';

describe('Reducer: savedAccounts(state, action)', () => {
  const account = {
    publicKey: 'sample_key_1',
    network: 'Custom node',
    address: 'http://localhost:4000',
  };
  const account2 = {
    publicKey: 'sample_key_2',
    network: 'Custom node',
    address: 'http://localhost:4000',
    passphrase: accounts.genesis.passphrase,
  };

  it('should return action.data if action.type = actionTypes.accountsRetrieved', () => {
    const state = { accounts: [] };
    const action = {
      type: actionTypes.accountsRetrieved,
      data: {
        accounts: [account, account2],
        lastActive: account2,
      },
    };
    const changedState = savedAccounts(state, action);
    expect(changedState).to.deep.equal(action.data);
  });

  it('should update corresponding account phassprasse when saving account', () => {
    const state = { accounts: [account, account2], lastActive: [] };
    const action = {
      type: actionTypes.accountSaved,
      data: {
        ...account,
        passphrase: accounts.genesis.passphrase,
        balance: 0,
      },
    };
    const accountUpdatedWithPassphrase = { ...state };
    accountUpdatedWithPassphrase.accounts[0] = {
      ...accountUpdatedWithPassphrase.accounts[0],
      passphrase: accounts.genesis.passphrase,
      balance: 0,
    };
    accountUpdatedWithPassphrase.lastActive = accountUpdatedWithPassphrase.accounts[0];

    const changedState = savedAccounts(state, action);
    expect(changedState).to.deep.equal(accountUpdatedWithPassphrase);
  });

  it('should return action.data with address if action.type = actionTypes.accountSaved', () => {
    const state = { accounts: [] };
    const action = {
      type: actionTypes.accountSaved,
      data: account,
    };
    const changedState = savedAccounts(state, action);
    expect(changedState).to.deep.equal({ accounts: [action.data], lastActive: action.data });
  });

  it('should return array without given account if action.type = actionTypes.accountRemoved', () => {
    const state = { accounts: [account, account2] };
    const action = {
      type: actionTypes.accountRemoved,
      data: account,
    };
    const changedState = savedAccounts(state, action);
    expect(changedState).to.deep.equal({ accounts: [account2] });
  });

  it('should return array same accounts without passphrase if action.type = actionTypes.removePassphrase', () => {
    const state = { accounts: [account, account2] };
    const action = {
      type: actionTypes.removePassphrase,
    };
    const changedState = savedAccounts(state, action);
    const account2WithoutPassphrase = { ...account2 };
    delete account2WithoutPassphrase.passphrase;
    expect(changedState).to.deep.equal({ accounts: [account, account2WithoutPassphrase] });
  });

  it('should update corresponding account passprasse when a passphrase is used', () => {
    const state = {
      accounts: [account, account2],
      lastActive: account2,
    };
    const action = {
      type: actionTypes.passphraseUsed,
      data: accounts.genesis.passphrase,
    };
    const accountsUpdated = savedAccounts(state, action);
    const accountPreserved = accountsUpdated.accounts[0];
    const accountsWithPassphraseUpdated = accountsUpdated.accounts[1];
    expect(accountPreserved).to.deep.equal(account);
    expect(accountsWithPassphraseUpdated.passphrase).to.deep.equal(accounts.genesis.passphrase);
  });
});

