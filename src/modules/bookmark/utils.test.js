import { expect } from 'chai';
import { stub } from 'sinon';
import { getIndexOfBookmark } from './utils';

describe('Bookmarks', () => {
  const accounts = {
    LSK: [
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
    ],
  };

  beforeEach(() => {
    stub(localStorage, 'getItem');
    stub(localStorage, 'setItem');
  });

  afterEach(() => {
    localStorage.getItem.restore();
    localStorage.setItem.restore();
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
