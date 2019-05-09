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
  const getState = () => ({
    peers: { liskAPIClient: {} },
  });

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

  it('should not update a followed account if balance and publicKey doesn\'t change', () => {
    stub(accountApi, 'getAccount').returnsPromise();

    accountApi.getAccount.resolves({
      balance: accounts.genesis.balance,
      publicKey: accounts.genesis.publicKey,
    });

    followedAccountFetchedAndUpdated({ account: data })(dispatch, getState);
    expect(dispatch).to.not.have.been.calledWith();

    accountApi.getAccount.restore();
  });

  it('should update a followed account if balance does change', () => {
    stub(accountApi, 'getAccount').returnsPromise();

    accountApi.getAccount.resolves({
      balance: 0,
      publicKey: accounts.genesis.publicKey,
    });

    followedAccountFetchedAndUpdated({ account: data })(dispatch, getState);
    expect(dispatch).to.been.calledWith(followedAccountUpdated({
      publicKey: accounts.genesis.publicKey,
      balance: 0,
      title: accounts.genesis.address,
    }));

    accountApi.getAccount.restore();
  });

  it('should update a followed account if publicKey does change', () => {
    stub(accountApi, 'getAccount').returnsPromise();

    accountApi.getAccount.resolves({
      balance: accounts.genesis.balance,
      publicKey: accounts.delegate.publicKey,
    });

    followedAccountFetchedAndUpdated({ account: data })(dispatch, getState);
    expect(dispatch).to.been.calledWith(followedAccountUpdated({
      publicKey: accounts.delegate.publicKey,
      balance: accounts.genesis.balance,
      title: accounts.genesis.address,
    }));

    accountApi.getAccount.restore();
  });

  it('should not update a followed account if publicKey changed to undefined', () => {
    stub(accountApi, 'getAccount').returnsPromise();

    accountApi.getAccount.resolves({
      balance: accounts.genesis.balance,
      publicKey: undefined,
    });

    followedAccountFetchedAndUpdated({ account: data })(dispatch, getState);
    expect(dispatch).to.been.calledWith(followedAccountUpdated({
      publicKey: accounts.delegate.publicKey,
      balance: accounts.genesis.balance,
      title: accounts.genesis.address,
    }));

    accountApi.getAccount.restore();
  });

  it('should not update a followed account if publicKey previously unexisted', () => {
    stub(accountApi, 'getAccount').returnsPromise();

    const testData = {
      balance: accounts.genesis.balance,
      title: accounts.genesis.address,
    };
    accountApi.getAccount.resolves({
      balance: accounts.genesis.balance,
      publicKey: accounts.delegate.publicKey,
    });

    followedAccountFetchedAndUpdated({ account: testData })(dispatch, getState);
    expect(dispatch).to.been.calledWith(followedAccountUpdated({
      publicKey: accounts.delegate.publicKey,
      balance: accounts.genesis.balance,
      title: accounts.genesis.address,
    }));

    accountApi.getAccount.restore();
  });
});
