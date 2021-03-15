import {
  bookmarkAdded,
  bookmarkRemoved,
  bookmarkUpdated,
} from './bookmarks';
import actionTypes from 'constants';
import accounts from '../../test/constants/accounts';
import { tokenMap } from 'constants';

describe('actions: boomarks', () => {
  const data = {
    account: {
      address: accounts.genesis.address,
      publicKey: accounts.genesis.publicKey,
      balance: accounts.genesis.balance,
      title: accounts.genesis.address,
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
      address: accounts.genesis.address,
      token: tokenMap.LSK.key,
    };
    const expectedAction = {
      data: removedData,
      type: actionTypes.bookmarkRemoved,
    };
    expect(bookmarkRemoved(removedData)).toEqual(expectedAction);
    expect(bookmarkRemoved({ address: accounts.genesis.address })).toEqual(expectedAction);
  });
});
