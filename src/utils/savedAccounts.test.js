import { expect } from 'chai';
import { mock } from 'sinon';
import {
  getSavedAccounts,
  getLastActiveAccount,
  setLastActiveAccount,
  setSavedAccount,
  removeSavedAccount,
} from './savedAccounts';

describe('savedAccounts', () => {
  let localStorageMock;
  const publicKey = 'fab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88';
  const accounts = [
    {
      publicKey: 'hab9d261ea050b9e326d7e11587eccc343a20e64e29d8781b50fd06683cacc88',
      network: 0,
    },
    {
      publicKey,
      network: 0,
    },
    {
      publicKey,
      network: 2,
      address: 'http://localhost:4000',
    },
  ];

  beforeEach(() => {
    localStorageMock = mock(localStorage);
  });

  afterEach(() => {
    localStorageMock.restore();
  });

  describe('getSavedAccounts', () => {
    it('returns [] if if localStorage.getItem(\'accounts\') returns undefined', () => {
      localStorageMock.expects('getItem').withExactArgs('accounts').returns(undefined);
      expect(getSavedAccounts()).to.deep.equal([]);
    });

    it('returns [] if if localStorage.getItem(\'accounts\') returns invalid JSON string', () => {
      localStorageMock.expects('getItem').withExactArgs('accounts').returns('{]');
      expect(getSavedAccounts()).to.deep.equal([]);
    });


    it('returns [] if if localStorage.getItem(\'accounts\') returns JSON encoded array with invalid data', () => {
      const invalidAccounts = [
        {
          publicKey: 'invalid',
        },
      ];
      localStorageMock.expects('getItem').withExactArgs('accounts').returns(JSON.stringify(invalidAccounts));
      expect(getSavedAccounts()).to.deep.equal([]);
    });

    it('returns array parsed from json in localStorage.getItem(\'accounts\')', () => {
      localStorageMock.expects('getItem').withExactArgs('accounts').returns(JSON.stringify(accounts));
      expect(getSavedAccounts()).to.deep.equal(accounts);
    });
  });

  describe('getLastActiveAccount', () => {
    it('returns first account if localStorage.getItem(\'lastActiveAccountIndex\') returns undefined', () => {
      localStorageMock.expects('getItem').withExactArgs('accounts').returns(JSON.stringify(accounts));
      localStorageMock.expects('getItem').withExactArgs('lastActiveAccountIndex').returns(undefined);
      expect(getLastActiveAccount()).to.deep.equal(accounts[0]);
    });

    it('returns nth account if localStorage.getItem(\'lastActiveAccountIndex\') returns n', () => {
      const n = 2;
      localStorageMock.expects('getItem').withExactArgs('accounts').returns(JSON.stringify(accounts));
      localStorageMock.expects('getItem').withExactArgs('lastActiveAccountIndex').returns(n);
      expect(getLastActiveAccount()).to.deep.equal(accounts[n]);
    });
  });

  describe('setLastActiveAccount', () => {
    it('sets nothing in localStorage if passed account is not in localStorageMock.accounts and returns -1', () => {
      localStorageMock.expects('getItem').withExactArgs('accounts').returns(JSON.stringify(accounts.slice(0, 1)));
      expect(setLastActiveAccount(accounts[2])).to.equal(-1);
    });

    it('sets index of passed account in localStorage.acocunts into localStorage and returns n', () => {
      const n = 2;
      localStorageMock.expects('getItem').withExactArgs('accounts').returns(JSON.stringify(accounts));
      localStorageMock.expects('setItem').withExactArgs('lastActiveAccountIndex', n);
      expect(setLastActiveAccount(accounts[n])).to.equal(n);
    });
  });

  describe('setSavedAccount', () => {
    it('sets accounts in localStorage with appended passed account and also returns it', () => {
      localStorageMock.expects('getItem').withExactArgs('accounts').returns(JSON.stringify(accounts.slice(0, 2)));
      localStorageMock.expects('setItem').withExactArgs('accounts', JSON.stringify(accounts));
      expect(setSavedAccount(accounts[2])).to.deep.equal(accounts);
    });
  });

  describe('removeSavedAccount', () => {
    it('sets accounts in localStorage with removed  passed account and also returns it', () => {
      localStorageMock.expects('getItem').withExactArgs('accounts').returns(JSON.stringify(accounts));
      localStorageMock.expects('setItem').withExactArgs('accounts', JSON.stringify(accounts.slice(0, 2)));
      expect(removeSavedAccount(accounts[2])).to.deep.equal(accounts.slice(0, 2));
    });
  });
});

