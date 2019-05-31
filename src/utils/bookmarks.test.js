import { expect } from 'chai';
import { stub } from 'sinon';
import {
  getBookmarksFromLocalStorage,
  setBookmarksInLocalStorage,
  getIndexOfBookmark,
} from './bookmarks';

describe('Bookmarks', () => {
  const bookmarksObj = { LSK: [], BTC: [] };
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

  describe('getBookmarksFromLocalStorage', () => {
    it('returns { LSK: [], BTC: [] } if localStorage.getItem(\'bookmarks\') returns undefined', () => {
      expect(getBookmarksFromLocalStorage()).to.deep.equal(bookmarksObj);
    });

    it('returns { LSK: [], BTC: [] } if localStorage.getItem(\'bookmarks\') returns invalid JSON string', () => {
      localStorage.getItem.returns('{]');
      expect(getBookmarksFromLocalStorage()).to.deep.equal(bookmarksObj);
      localStorage.getItem.returns('{}');
      expect(getBookmarksFromLocalStorage()).to.deep.equal({});
    });

    it('returns { LSK: [], BTC: [] } if localStorage.getItem(\'bookmarks\') returns JSON encoded array with invalid data', () => {
      localStorage.getItem.returns('[]');
      expect(getBookmarksFromLocalStorage()).to.deep.equal(bookmarksObj);
    });

    it('returns object parsed from json in localStorage.getItem(\'bookmarks\')', () => {
      localStorage.getItem.returns(JSON.stringify(accounts));
      expect(getBookmarksFromLocalStorage()).to.deep.equal(accounts);
    });
  });

  describe('setBookmarksInLocalStorage', () => {
    it('sets accounts in localStorage with appended passed account and also returns it', () => {
      setBookmarksInLocalStorage(accounts);
      expect(localStorage.setItem).to.have.been.calledWith('bookmarks', JSON.stringify(accounts));
    });
  });

  describe('getIndexOfBookmark', () => {
    it('gets the index based on the address', () => {
      const data = {
        address: accounts.LSK[0].address,
        token: 'LSK',
      };
      expect(getIndexOfBookmark(accounts, data)).to.equal(0);
    });
  });
});
