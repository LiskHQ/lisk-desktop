import { useFakeTimers } from 'sinon';
import account from './account';
import accounts from '../../../test/constants/accounts';
import actionTypes from '../../constants/actions';
import accountConst from '../../constants/account';


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
        address: state.address,
        balance: 100000000,
        token: 'LSK',
      },
    };
    const changedAccount = account(state, action);
    expect(changedAccount).toEqual({
      ...state,
      info: {
        LSK: action.data,
      },
    });
  });

  it('should return empty_account object if action.type = actionTypes.accountLoggedOut', () => {
    const action = {
      type: actionTypes.accountLoggedOut,
    };
    const changedAccount = account(state, action);
    expect(changedAccount).toEqual({ afterLogout: true });
  });

  it('should return loading account object if action.type = actionTypes.accountLoading', () => {
    const action = {
      type: actionTypes.accountLoading,
    };
    const changedAccount = account(state, action);
    expect(changedAccount).toEqual({ loading: true });
  });

  it('should extend expireTime if action.type = actionTypes.passphraseUsed', () => {
    const clock = useFakeTimers(new Date('2017-12-29').getTime());
    const action = {
      type: actionTypes.passphraseUsed,
      data: new Date('2017-12-29T00:00:00.000Z'),
    };
    const changedAccount = account(state, action);
    expect(changedAccount).toEqual({
      ...state,
      expireTime: new Date('2017-12-29T00:10:00.000Z'),
    });
    clock.restore();
  });


  it('should return remove passphrase from account object if actionTypes.removePassphrase is called', () => {
    const action = {
      type: actionTypes.removePassphrase,
    };
    const changedAccount = account(state, action);
    expect(changedAccount.passphrase).toEqual(null);
  });

  it('should reduce account when accountLoggedIn has been triggered', () => {
    const action = {
      data: {
        delegate: accounts.delegate_candidate,
      },
      type: actionTypes.accountLoggedIn,
    };
    const accountWithDelegateUpdated = account(state, action);
    expect(accountWithDelegateUpdated.delegate).toEqual(accounts.delegate_candidate);
  });

  it('should return state if action.type is none of the above', () => {
    const action = {
      type: 'UNKNOWN',
    };
    const changedAccount = account(state, action);
    expect(changedAccount).toEqual(state);
  });
});
