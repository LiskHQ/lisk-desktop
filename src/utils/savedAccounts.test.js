import { expect } from 'chai';
import {
  getSavedAccounts,
  getLastActiveAccount,
  setLastActiveAccount,
  setSavedAccounts,
} from './savedAccounts';

describe('savedAccounts', () => {
  const publicKey = 'fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88';
  const accounts = [
    {
      publicKey: 'hab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88',
      network: 0,
      balance: 0,
    },
    {
      publicKey,
      network: 0,
      balance: 0,
    },
    {
      publicKey,
      network: 2,
      peerAddress: 'http://localhost:4000',
      balance: 0,
    },
  ];

  let storage = {};
  beforeEach(() => {
    window.localStorage.getItem = key => (storage[key]);
    window.localStorage.setItem = (key, item) => { storage[key] = item; };
  });

  afterEach(() => {
    storage = {};
  });

  describe('getSavedAccounts', () => {
    it('returns [] if if localStorage.getItem(\'accounts\') returns undefined', () => {
      expect(getSavedAccounts()).to.deep.equal([]);
    });

    it('returns [] if if localStorage.getItem(\'accounts\') returns invalid JSON string', () => {
      window.localStorage.setItem('accounts', '{]');
      expect(getSavedAccounts()).to.deep.equal([]);
    });


    it('returns [] if if localStorage.getItem(\'accounts\') returns JSON encoded array with invalid data', () => {
      const invalidAccounts = [
        {
          publicKey: 'invalid',
        },
      ];
      window.localStorage.setItem('accounts', JSON.stringify(invalidAccounts));
      expect(getSavedAccounts()).to.deep.equal([]);
    });

    it('returns array parsed from json in localStorage.getItem(\'accounts\')', () => {
      window.localStorage.setItem('accounts', JSON.stringify(accounts));
      expect(getSavedAccounts()).to.deep.equal(accounts);
    });
  });

  describe('getLastActiveAccount', () => {
    it('returns first account if localStorage.getItem(\'lastActiveAccountIndex\') returns undefined', () => {
      window.localStorage.setItem('accounts', JSON.stringify(accounts));
      expect(getLastActiveAccount()).to.deep.equal(accounts[0]);
    });

    it('returns nth account if localStorage.getItem(\'lastActiveAccountIndex\') returns n', () => {
      const n = 2;
      window.localStorage.setItem('accounts', JSON.stringify(accounts));
      window.localStorage.setItem('lastActiveAccountIndex', n);
      expect(getLastActiveAccount()).to.deep.equal(accounts[n]);
    });
  });

  describe('setLastActiveAccount', () => {
    it('sets nothing in localStorage if passed account is not in localStorageMock.accounts and returns -1', () => {
      window.localStorage.setItem('accounts', JSON.stringify(accounts.slice(0, 1)));
      setLastActiveAccount(accounts[2]);
      expect(window.localStorage.getItem('lastActiveAccountIndex')).to.equal(undefined);
    });

    it('sets index of passed account in localStorage.acocunts into localStorage and returns n', () => {
      const n = 2;
      window.localStorage.setItem('accounts', JSON.stringify(accounts));
      setLastActiveAccount(accounts[n]);
      expect(window.localStorage.getItem('lastActiveAccountIndex')).to.equal(n);
    });
  });

  describe('setSavedAccounts', () => {
    it('sets accounts in localStorage with appended passed account and also returns it', () => {
      setSavedAccounts([accounts[2]]);
      expect(JSON.parse(window.localStorage.getItem('accounts'))).to.deep.equal([accounts[2]]);
    });
  });
});

