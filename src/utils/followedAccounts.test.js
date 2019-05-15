import { expect } from 'chai';
import { stub } from 'sinon';
import {
  getFollowedAccountsFromLocalStorage,
  setFollowedAccountsInLocalStorage,
  getIndexOfFollowedAccount,
} from './followedAccounts';

describe('followedAccounts', () => {
  const followedAccountsObj = { LSK: [], BTC: [] };
  const accounts = {
    LSK: [{
      address: '1234L',
      title: 'some title',
      balance: 0,
    }, {
      address: '5678L',
      title: 'some title',
      balance: 100000,
    }],
    BTC: [],
  };

  beforeEach(() => {
    stub(localStorage, 'getItem');
    stub(localStorage, 'setItem');
  });

  afterEach(() => {
    localStorage.getItem.restore();
    localStorage.setItem.restore();
  });

  describe('getFollowedAccountsFromLocalStorage', () => {
    it('returns { LSK: [], BTC: [] } if localStorage.getItem(\'followedAccounts\') returns undefined', () => {
      expect(getFollowedAccountsFromLocalStorage()).to.deep.equal(followedAccountsObj);
    });

    it('returns { LSK: [], BTC: [] } if localStorage.getItem(\'followedAccounts\') returns invalid JSON string', () => {
      localStorage.getItem.returns('{]');
      expect(getFollowedAccountsFromLocalStorage()).to.deep.equal(followedAccountsObj);
      localStorage.getItem.returns('{}');
      expect(getFollowedAccountsFromLocalStorage()).to.deep.equal({});
    });

    it('returns { LSK: [], BTC: [] } if localStorage.getItem(\'followedAccounts\') returns JSON encoded array with invalid data', () => {
      localStorage.getItem.returns('[]');
      expect(getFollowedAccountsFromLocalStorage()).to.deep.equal(followedAccountsObj);
    });

    it('returns object parsed from json in localStorage.getItem(\'followedAccounts\')', () => {
      localStorage.getItem.returns(JSON.stringify(accounts));
      expect(getFollowedAccountsFromLocalStorage()).to.deep.equal(accounts);
    });
  });

  describe('setFollowedAccountsInLocalStorage', () => {
    it('sets accounts in localStorage with appended passed account and also returns it', () => {
      setFollowedAccountsInLocalStorage(accounts);
      expect(localStorage.setItem).to.have.been.calledWith('followedAccounts', JSON.stringify(accounts));
    });
  });

  describe('getIndexOfFollowedAccount', () => {
    it('gets the index based on the address', () => {
      const data = {
        address: accounts.LSK[0].address,
        token: 'LSK',
      };
      expect(getIndexOfFollowedAccount(accounts, data)).to.equal(0);
    });
  });
});
