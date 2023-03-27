import { tokenMap } from '@token/fungible/consts/tokens';
import { getFromStorage } from 'src/utils/localJSONStorage';
import { emptyBookmarks } from '@bookmark/utils';
import wallets from '@tests/constants/wallets';
import actionTypes from './actionTypes';
import { bookmarksRetrieved, bookmarkAdded, bookmarkRemoved, bookmarkUpdated } from './action';

jest.mock('src/utils/localJSONStorage', () => ({
  getFromStorage: jest.fn(),
}));

describe('actions: bookmarks', () => {
  const data = {
    wallet: {
      address: wallets.genesis.summary.address,
      publicKey: wallets.genesis.summary.publicKey,
      balance: wallets.genesis.balance,
      title: wallets.genesis.summary.address,
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
        },
      });
    });
  });

  it('should create an action to add a bookmark wallet', () => {
    const expectedAction = {
      data,
      type: actionTypes.bookmarkAdded,
    };
    expect(bookmarkAdded(data)).toEqual(expectedAction);
    expect(bookmarkAdded({ wallet: data.wallet })).toEqual(expectedAction);
  });

  it('should create an action to update a bookmark wallet', () => {
    const expectedAction = {
      data,
      type: actionTypes.bookmarkUpdated,
    };
    expect(bookmarkUpdated(data)).toEqual(expectedAction);
    expect(bookmarkUpdated({ wallet: data.wallet })).toEqual(expectedAction);
  });

  it('should create an action to remove a bookmark wallet', () => {
    const removedData = {
      address: wallets.genesis.summary.address,
      token: tokenMap.LSK.key,
    };
    const expectedAction = {
      data: removedData,
      type: actionTypes.bookmarkRemoved,
    };
    expect(bookmarkRemoved(removedData)).toEqual(expectedAction);
    expect(bookmarkRemoved({ address: wallets.genesis.summary.address })).toEqual(expectedAction);
  });
});
