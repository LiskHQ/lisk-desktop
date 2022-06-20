import wallets from '@tests/constants/wallets';
import actionTypes from '../actionTypes';
import wallet from './reducer';

describe('Reducer: account(state, action)', () => {
  let state;

  beforeEach(() => {
    const {
      passphrase,
      publicKey,
      address,
    } = wallets.genesis;
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
    const changedWallet = wallet(state, action);
    expect(changedWallet).toEqual({
      ...state,
      info: action.data,
    });
  });

  it('should return empty_wallet object if action.type = actionTypes.accountLoggedOut', () => {
    const action = {
      type: actionTypes.accountLoggedOut,
    };
    const changedWallet = wallet(state, action);
    expect(changedWallet).toEqual({ afterLogout: true });
  });

  it('should return account object with changes if action.type = actionTypes.timerReset', () => {
    const action = {
      type: actionTypes.timerReset,
      data: new Date('2021-02-09T15:37:25.880Z'),
    };
    const changedWallet = wallet(state, action);
    expect(changedWallet).toEqual({
      ...state,
      expireTime: new Date('2021-02-09T15:47:25.880Z'),
    });
  });

  it('should return loading account object if action.type = actionTypes.accountLoading', () => {
    const action = {
      type: actionTypes.accountLoading,
    };
    const changedWallet = wallet(state, action);
    expect(changedWallet).toEqual({ loading: true });
  });

  it('should reduce account when accountLoggedIn has been triggered', () => {
    const action = {
      data: {
        delegate: wallets.delegate_candidate,
        date: new Date(),
      },
      type: actionTypes.accountLoggedIn,
    };
    const accountWithDelegateUpdated = wallet(state, action);
    expect(accountWithDelegateUpdated.delegate).toEqual(wallets.delegate_candidate);
  });

  it('should store the second passphrase once called with secondPassphraseStored', () => {
    const action = {
      data: 'sample passphrase',
      type: actionTypes.secondPassphraseStored,
    };
    const updatedState = wallet(state, action);
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
    const updatedState = wallet(oldState, action);
    expect(updatedState.secondPassphrase).toEqual(null);
  });

  it('should return state if action.type is none of the above', () => {
    const action = {
      type: 'UNKNOWN',
    };
    const changedWallet = wallet(state, action);
    expect(changedWallet).toEqual(state);
  });
});
