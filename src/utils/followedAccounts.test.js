import { expect } from 'chai';
import {
  getFollowedAccountsFromLocalStorage,
  setFollowedAccountsInLocalStorage,
  getIndexOfFollowedAccount,
} from './followedAccounts';

describe('followedAccounts', () => {
  const accounts = [
    {
      address: '1234L',
      title: 'some title',
      balance: 0,
    },
    {
      address: '5678L',
      title: 'some title',
      balance: 100000,
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

  describe('getFollowedAccountsFromLocalStorage', () => {
    it('returns [] if if localStorage.getItem(\'followedAccounts\') returns undefined', () => {
      expect(getFollowedAccountsFromLocalStorage()).to.deep.equal([]);
    });

    it('returns [] if if localStorage.getItem(\'followedAccounts\') returns invalid JSON string', () => {
      window.localStorage.setItem('followedAccounts', '{]');
      expect(getFollowedAccountsFromLocalStorage()).to.deep.equal([]);
      window.localStorage.setItem('followedAccounts', '{}');
      expect(getFollowedAccountsFromLocalStorage()).to.deep.equal([]);
    });

    it('returns [] if if localStorage.getItem(\'followedAccounts\') returns JSON encoded array with invalid data', () => {
      const invalidAccounts = [{ address: 'invalid' }];

      window.localStorage.setItem('followedAccounts', JSON.stringify(invalidAccounts));
      expect(getFollowedAccountsFromLocalStorage()).to.deep.equal([]);
    });

    it('returns array parsed from json in localStorage.getItem(\'followedAccounts\')', () => {
      window.localStorage.setItem('followedAccounts', JSON.stringify(accounts));
      expect(getFollowedAccountsFromLocalStorage()).to.deep.equal(accounts);
    });
  });

  describe('setFollowedAccountsInLocalStorage', () => {
    it('sets accounts in localStorage with appended passed account and also returns it', () => {
      setFollowedAccountsInLocalStorage([accounts[0]]);
      expect(JSON.parse(window.localStorage.getItem('followedAccounts'))).to.deep.equal([accounts[0]]);
    });
  });

  describe('getIndexOfFollowedAccount', () => {
    it('gets the index based on the address', () => {
      expect(getIndexOfFollowedAccount(accounts, accounts[0])).to.equal(0);
    });
  });
});
