import { expect } from 'chai';
import { spy, stub } from 'sinon';
import {
  followedAccountFetchedAndUpdated,
  followedAccountUpdated,
  followedAccountsRetrieved,
  followedAccountAdded,
  followedAccountRemoved,
} from './followedAccounts';
import actionTypes from '../constants/actions';
import * as accountApi from '../utils/api/account';
import accounts from '../../test/constants/accounts';

describe('actions: followedAccount', () => {
  const dispatch = spy();
  const data = {
    publicKey: accounts.genesis.publicKey,
    balance: accounts.genesis.balance,
    title: accounts.genesis.address,
  };

  it('should create an action to retrieve the followed accounts list', () => {
    const expectedAction = {
      data,
      type: actionTypes.followedAccountsRetrieved,
    };
    expect(followedAccountsRetrieved(data)).to.be.deep.equal(expectedAction);
  });

  it('should create an action to add a followed account', () => {
    const expectedAction = {
      data,
      type: actionTypes.followedAccountAdded,
    };
    expect(followedAccountAdded(data)).to.be.deep.equal(expectedAction);
  });

  it('should create an action to update a followed account', () => {
    const expectedAction = {
      data,
      type: actionTypes.followedAccountUpdated,
    };
    expect(followedAccountUpdated(data)).to.be.deep.equal(expectedAction);
  });

  it('should create an action to remove a followed account', () => {
    const expectedAction = {
      data,
      type: actionTypes.followedAccountRemoved,
    };
    expect(followedAccountRemoved(data)).to.be.deep.equal(expectedAction);
  });

  it('should update a followed account if balance changed', () => {
    stub(accountApi, 'getAccount').returnsPromise();

    // Case 1: balance does not change
    accountApi.getAccount.resolves({ balance: accounts.genesis.balance });

    followedAccountFetchedAndUpdated({ activePeer: {}, account: data })(dispatch);
    expect(dispatch).to.not.have.been.calledWith();

    // Case 2: balance does change
    accountApi.getAccount.resolves({ balance: 0 });

    followedAccountFetchedAndUpdated({ activePeer: {}, account: data })(dispatch);
    expect(dispatch).to.been.calledWith(followedAccountUpdated({
      publicKey: accounts.genesis.publicKey,
      balance: 0,
      title: accounts.genesis.address,
    }));

    accountApi.getAccount.restore();
  });
});
