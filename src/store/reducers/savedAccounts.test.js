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

  it('should return action.data with phassprasse if action.type = actionTypes.accountSaved and phassprasse in action data', () => {
    const state = { accounts: [account, account2] };
    const action = {
      type: actionTypes.accountSaved,
      data: account2,
    };
    const changedState = savedAccounts(state, action);
    expect(changedState.accounts[1].passphrase).to.equal(account2.passphrase);
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

  it('should return array same accounts with passphrase updated to action data if action.type = actionTypes.passphraseUsed', () => {
    const state = {
      accounts: [account, account2],
      lastActive: account2,
    };
    const action = {
      type: actionTypes.passphraseUsed,
      data: accounts.genesis.passphrase,
    };
    const changedState = savedAccounts(state, action);
    expect(changedState.accounts[0]).to.deep.equal(account);
    expect(changedState.accounts[1].passphrase).to.deep.equal(accounts.genesis.passphrase);
  });
});

