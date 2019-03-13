import { genesis } from '../../test/constants/accounts';
import {
  getWalletsFromLocalStorage,
  setWalletsInLocalStorage,
} from './wallets';

describe('Wallets Utils', () => {
  const walletsObject = {
    [genesis.address]: {
      balance: genesis.balance,
      lastBalance: 0,
    },
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe('getWalletsFromLocalStorage', () => {
    it('returns {} if if localStorage.getItem(\'wallets\') returns undefined', () => {
      expect(getWalletsFromLocalStorage()).toEqual({});
    });

    it('returns {} if if localStorage.getItem(\'wallets\') returns invalid JSON string', () => {
      localStorage.setItem('wallets', '{]');
      expect(getWalletsFromLocalStorage()).toEqual({});
    });

    it('returns array parsed from json in localStorage.getItem(\'wallets\')', () => {
      localStorage.setItem('wallets', JSON.stringify(walletsObject));
      expect(getWalletsFromLocalStorage()).toEqual(walletsObject);
    });
  });

  describe('setWalletsInLocalStorage', () => {
    it('sets wallets in localStorage and also returns it', () => {
      setWalletsInLocalStorage(walletsObject);
      expect(localStorage.getItem('wallets')).toEqual(JSON.stringify(walletsObject));
    });
  });
});
