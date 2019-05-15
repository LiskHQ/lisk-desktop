import {
  followedAccountUpdated,
  followedAccountAdded,
  followedAccountRemoved,
} from './followedAccounts';
import actionTypes from '../constants/actions';
import accounts from '../../test/constants/accounts';

describe('actions: followedAccount', () => {
  const data = {
    account: {
      address: accounts.genesis.address,
      publicKey: accounts.genesis.publicKey,
      balance: accounts.genesis.balance,
      title: accounts.genesis.address,
    },
    token: 'LSK',
  };

  it('should create an action to add a followed account', () => {
    const expectedAction = {
      data,
      type: actionTypes.followedAccountAdded,
    };
    expect(followedAccountAdded(data)).toEqual(expectedAction);
    expect(followedAccountAdded({ account: data.account })).toEqual(expectedAction);
  });

  it('should create an action to update a followed account', () => {
    const expectedAction = {
      data,
      type: actionTypes.followedAccountUpdated,
    };
    expect(followedAccountUpdated(data)).toEqual(expectedAction);
    expect(followedAccountUpdated({ account: data.account })).toEqual(expectedAction);
  });

  it('should create an action to remove a followed account', () => {
    const removedData = {
      address: accounts.genesis.address,
      token: 'LSK',
    };
    const expectedAction = {
      data: removedData,
      type: actionTypes.followedAccountRemoved,
    };
    expect(followedAccountRemoved(removedData)).toEqual(expectedAction);
    expect(followedAccountRemoved({ address: accounts.genesis.address })).toEqual(expectedAction);
  });
});
