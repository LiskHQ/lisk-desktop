import wallets from '@tests/constants/wallets';
import actionTypes from '../actionTypes';
import wallet from './reducer';

describe('Reducer: account(state, action)', () => {
  let state;

  beforeEach(() => {
    const { passphrase, publicKey, address } = wallets.genesis;
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
