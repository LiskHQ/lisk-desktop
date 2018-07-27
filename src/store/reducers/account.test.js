import { expect } from 'chai';
import account from './account';
import accounts from '../../../test/constants/accounts';
import actionTypes from '../../constants/actions';


describe('Reducer: account(state, action)', () => {
  let state;

  beforeEach(() => {
    const {
      passphrase,
      publicKey,
      address,
    } = accounts.genesis;
    state = {
      balance: 0,
      passphrase,
      publicKey,
      address,
    };
  });

  it('should return account object with changes if action.type = actionTypes.accountUpdated', () => {
    const action = {
      type: actionTypes.accountUpdated,
      data: {
        passphrase: state.passphrase,
        balance: 100000000,
      },
    };
    const changedAccount = account(state, action);
    expect(changedAccount).to.deep.equal({
      balance: action.data.balance,
      passphrase: state.passphrase,
      publicKey: state.publicKey,
      address: state.address,
    });
  });

  it('should return empty account object if action.type = actionTypes.accountLoggedOut', () => {
    const action = {
      type: actionTypes.accountLoggedOut,
    };
    const changedAccount = account(state, action);
    expect(changedAccount).to.deep.equal({ afterLogout: true });
  });

  it('should return remove passphrase from account object if actionTypes.removePassphrase is called', () => {
    const action = {
      type: actionTypes.removePassphrase,
    };
    const changedAccount = account(state, action);
    expect(changedAccount.passphrase).to.be.equal(null);
  });

  it('should reduce account delegate when updateDelegate has been triggered', () => {
    const action = {
      data: {
        delegate: accounts['delegate candidate'],
      },
      type: actionTypes.updateDelegate,
    };
    const accountWithDelegateUpdated = account(state, action);
    expect(accountWithDelegateUpdated.delegate).to.be.equal(accounts['delegate candidate']);
  });

  it('should reduce account delegate when loading transactions', () => {
    const action = {
      data: {
        delegate: accounts['delegate candidate'],
      },
      type: actionTypes.transactionsLoadFinish,
    };
    const accountWithDelegateUpdated = account(state, action);
    expect(accountWithDelegateUpdated.delegate).to.be.equal(accounts['delegate candidate']);
  });

  it('should return state if action.type is none of the above', () => {
    const action = {
      type: 'UNKNOWN',
    };
    const changedAccount = account(state, action);
    expect(changedAccount).to.deep.equal(state);
  });

  it('should add votes to state', () => {
    const action = {
      type: actionTypes.accountAddVotes,
      votes: [{ id: 123 }],
    };
    const changedAccount = account({}, action);
    expect(changedAccount).to.deep.equal({ votes: action.votes });
  });

  it('should add voters to state', () => {
    const action = {
      type: actionTypes.accountAddVoters,
      voters: [{ id: 123 }],
    };
    const changedAccount = account({}, action);
    expect(changedAccount).to.deep.equal({ voters: action.voters });
  });
});

