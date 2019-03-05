import wallets from './wallets';
import accounts from '../../../test/constants/accounts';
import * as walletUtils from '../../utils/wallets';

jest.mock('../../utils/wallets');

describe('Subscriber: wallets(store)', () => {
  const walletsState = {
    [accounts.genesis.address]: {
      balance: accounts.genesis.balance,
      lastBalance: 0,
    },
  };

  it('should save wallets in localStorage', () => {
    const state = { wallets: walletsState };
    const store = { getState: () => state };

    wallets(store);

    expect(walletUtils.setWalletsInLocalStorage).toBeCalledWith(state.wallets);
  });
});

