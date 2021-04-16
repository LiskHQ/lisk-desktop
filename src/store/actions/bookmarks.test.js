import { tokenMap, actionTypes } from '@constants';
import {
  bookmarkAdded,
  bookmarkRemoved,
  bookmarkUpdated,
} from './bookmarks';
import accounts from '../../../test/constants/accounts';

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
