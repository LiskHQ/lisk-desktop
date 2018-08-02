import { expect } from 'chai';
import { stub } from 'sinon';
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

  beforeEach(() => {
    stub(localStorage, 'getItem');
    stub(localStorage, 'setItem');
  });

  afterEach(() => {
    localStorage.getItem.restore();
    localStorage.setItem.restore();
  });

  describe('getFollowedAccountsFromLocalStorage', () => {
    it('returns [] if if localStorage.getItem(\'followedAccounts\') returns undefined', () => {
      expect(getFollowedAccountsFromLocalStorage()).to.deep.equal([]);
    });

    it('returns [] if if localStorage.getItem(\'followedAccounts\') returns invalid JSON string', () => {
      localStorage.getItem.returns('{]');
      expect(getFollowedAccountsFromLocalStorage()).to.deep.equal([]);
      localStorage.getItem.returns('{}');
      expect(getFollowedAccountsFromLocalStorage()).to.deep.equal([]);
    });

    it('returns [] if if localStorage.getItem(\'followedAccounts\') returns JSON encoded array with invalid data', () => {
      const invalidAccounts = [{ address: 'invalid' }];

      localStorage.getItem.returns(JSON.stringify(invalidAccounts));
      expect(getFollowedAccountsFromLocalStorage()).to.deep.equal([]);
    });

    it('returns array parsed from json in localStorage.getItem(\'followedAccounts\')', () => {
      localStorage.getItem.returns(JSON.stringify(accounts));
      expect(getFollowedAccountsFromLocalStorage()).to.deep.equal(accounts);
    });
  });

  describe('setFollowedAccountsInLocalStorage', () => {
    it('sets accounts in localStorage with appended passed account and also returns it', () => {
      setFollowedAccountsInLocalStorage([accounts[0]]);
      expect(localStorage.setItem).to.have.been.calledWith('followedAccounts', JSON.stringify([accounts[0]]));
    });
  });

  describe('getIndexOfFollowedAccount', () => {
    it('gets the index based on the address', () => {
      expect(getIndexOfFollowedAccount(accounts, accounts[0])).to.equal(0);
    });
  });
});
