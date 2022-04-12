import actionTypes from './actionTypes';
import accounts from '@tests/constants/accounts';
import account from './reducer';

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
        LSK: {
          address: state.address,
          balance: 100000000,
        },
      },
    };
    const changedAccount = account(state, action);
    expect(changedAccount).toEqual({
      ...state,
      info: action.data,
    });
  });

  it('should return empty_account object if action.type = actionTypes.accountLoggedOut', () => {
    const action = {
      type: actionTypes.accountLoggedOut,
    };
    const changedAccount = account(state, action);
    expect(changedAccount).toEqual({ afterLogout: true });
  });

  it('should return account object with changes if action.type = actionTypes.timerReset', () => {
    const action = {
      type: actionTypes.timerReset,
      data: new Date('2021-02-09T15:37:25.880Z'),
    };
    const changedAccount = account(state, action);
    expect(changedAccount).toEqual({
      ...state,
      expireTime: new Date('2021-02-09T15:47:25.880Z'),
    });
  });

  it('should return loading account object if action.type = actionTypes.accountLoading', () => {
    const action = {
      type: actionTypes.accountLoading,
    };
    const changedAccount = account(state, action);
    expect(changedAccount).toEqual({ loading: true });
  });

  it('should reduce account when accountLoggedIn has been triggered', () => {
    const action = {
      data: {
        delegate: accounts.delegate_candidate,
        date: new Date(),
      },
      type: actionTypes.accountLoggedIn,
    };
    const accountWithDelegateUpdated = account(state, action);
    expect(accountWithDelegateUpdated.delegate).toEqual(accounts.delegate_candidate);
  });

  it('should store the second passphrase once called with secondPassphraseStored', () => {
    const action = {
      data: 'sample passphrase',
      type: actionTypes.secondPassphraseStored,
    };
    const updatedState = account(state, action);
    expect(updatedState.secondPassphrase).toEqual(action.data);
  });

  it('should remove the second passphrase once called with secondPassphraseRemoved', () => {
    const action = {
      type: actionTypes.secondPassphraseRemoved,
    };
    const oldState = {
      ...state,
      secondPassphrase: 'sample passphrase',
    };
    const updatedState = account(oldState, action);
    expect(updatedState.secondPassphrase).toEqual(null);
  });

  it('should return state if action.type is none of the above', () => {
    const action = {
      type: 'UNKNOWN',
    };
    const changedAccount = account(state, action);
    expect(changedAccount).toEqual(state);
  });
});
