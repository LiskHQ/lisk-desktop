import actionTypes from './actionTypes';
import { tokenMap } from '@token/configuration/tokens';
import { getFromStorage } from '@common/utilities/localJSONStorage';
import { emptyBookmarks } from '@bookmark/utilities/bookmarks';
import accounts from '@tests/constants/accounts';
import {
  bookmarksRetrieved,
  bookmarkAdded,
  bookmarkRemoved,
  bookmarkUpdated,
} from './action';

jest.mock('@common/utilities/localJSONStorage', () => ({
  getFromStorage: jest.fn(),
}));

describe('actions: boomarks', () => {
  const data = {
    account: {
      address: accounts.genesis.summary.address,
      publicKey: accounts.genesis.summary.publicKey,
      balance: accounts.genesis.balance,
      title: accounts.genesis.summary.address,
    },
    token: tokenMap.LSK.key,
  };
  const dispatch = jest.fn();
  describe('bookmarksRetrieved', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('gets bookmarks from localJSONStorage', () => {
      getFromStorage.mockImplementation((_, __, cb) => {
        cb({
          LSK: [{}],
          BTC: [],
        });
      });

      bookmarksRetrieved()(dispatch);
      expect(getFromStorage).toBeCalledTimes(1);
      expect(getFromStorage.mock.calls[0][0]).toBe('bookmarks');
      expect(getFromStorage.mock.calls[0][1]).toBe(emptyBookmarks);
      expect(dispatch).toBeCalledTimes(1);
      expect(dispatch).toBeCalledWith({
        type: actionTypes.bookmarksRetrieved,
        data: {
          LSK: [{ disabled: true }],
          BTC: [],
        },
      });
    });
  });

  it('should create an action to add a bookmark account', () => {
    const expectedAction = {
      data,
      type: actionTypes.bookmarkAdded,
    };
    expect(bookmarkAdded(data)).toEqual(expectedAction);
    expect(bookmarkAdded({ account: data.account })).toEqual(expectedAction);
  });

  it('should create an action to update a bookmark account', () => {
    const expectedAction = {
      data,
      type: actionTypes.bookmarkUpdated,
    };
    expect(bookmarkUpdated(data)).toEqual(expectedAction);
    expect(bookmarkUpdated({ account: data.account })).toEqual(expectedAction);
  });

  it('should create an action to remove a bookmark account', () => {
    const removedData = {
      address: accounts.genesis.summary.address,
      token: tokenMap.LSK.key,
    };
    const expectedAction = {
      data: removedData,
      type: actionTypes.bookmarkRemoved,
    };
    expect(bookmarkRemoved(removedData)).toEqual(expectedAction);
    expect(bookmarkRemoved({ address: accounts.genesis.summary.address })).toEqual(expectedAction);
  });
});
