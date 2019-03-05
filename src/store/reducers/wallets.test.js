import wallets from './wallets';
import actionTypes from '../../constants/actions';
import accounts from '../../../test/constants/accounts';

describe('Reducer: wallets(state, action)', () => {
  let state;

  beforeEach(() => {
    state = {
      [accounts.genesis.address]: {
        balance: 0,
        lastBalance: 0,
      },
      [accounts['empty account'].address]: {
        balance: accounts['empty account'].balance,
        lastBalance: accounts['empty account'].balance,
      },
    };
  });

  it('should return wallets object with all wallets if action.type = actionTypes.walletUpdated', () => {
    const action = {
      type: actionTypes.walletUpdated,
      data: {
        [accounts.genesis.address]: {
          balance: accounts.genesis.balance,
          lastBalance: accounts.genesis.balance,
        },
      },
    };
    const changedState = wallets(state, action);
    expect(changedState).toEqual({ ...state, ...action.data });
  });
});

