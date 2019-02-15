import actionTypes from '../constants/actions';
import accounts from '../../test/constants/accounts';
import * as walletsUtils from '../utils/wallets';
import {
  updateWallet,
  setWalletsLastBalance,
} from './wallets';

jest.mock('../utils/wallets');

describe('actions: wallets', () => {
  describe('updateWallet', () => {
    it('should create an action to add stored wallet', () => {
      const localStorageWallets = {
        '12345L': {
          balance: 0,
        },
      };
      const account = {
        [accounts.genesis.address]: {
          balance: accounts.genesis.balance,
        },
      };
      walletsUtils.getWalletsFromLocalStorage.mockReturnValue(localStorageWallets);

      const expectedAction = {
        data: { ...localStorageWallets, ...account },
        type: actionTypes.walletUpdated,
      };
      expect(updateWallet(accounts.genesis)).toEqual(expectedAction);
    });

    it('should create an action to update one store wallet', () => {
      walletsUtils.getWalletsFromLocalStorage.mockReturnValue({
        [accounts.genesis.address]: { balance: 0 },
      });
      const data = {
        [accounts.genesis.address]: {
          balance: accounts.genesis.balance,
        },
      };

      const expectedAction = {
        data,
        type: actionTypes.walletUpdated,
      };
      expect(updateWallet(accounts.genesis)).toEqual(expectedAction);
    });
  });

  describe('setWalletsLastBalance', () => {
    it('should create an action to set wallets in the redux store', () => {
      const data = {
        [accounts.genesis.address]: {
          balance: accounts.genesis.balance,
          lastBalance: accounts.genesis.balance,
        },
        [accounts['empty account'].address]: {
          balance: accounts['empty account'].balance,
          lastBalance: accounts['empty account'].balance,
        },
      };
      walletsUtils.getWalletsFromLocalStorage.mockReturnValue(data);

      const expectedAction = {
        data,
        type: actionTypes.setWalletsLastBalance,
      };

      expect(setWalletsLastBalance()).toEqual(expectedAction);
    });
  });
});
