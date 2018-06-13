import { expect } from 'chai';
import { spy } from 'sinon';
import followedAccounts from './followedAccounts';
import * as followedAccountsUtils from '../../utils/followedAccounts';
import accounts from '../../../test/constants/accounts';

describe('Subscriber: followedAccounts(state)', () => {
  const account = {
    publicKey: accounts.genesis.publicKey,
    balance: accounts.genesis.balance,
    title: accounts.genesis.address,
  };
  const account2 = {
    publicKey: accounts.delegate.publicKey,
    balance: accounts.delegate.balance,
    title: accounts.delegate.address,
  };

  it('should save accounts in localStorage', () => {
    spy(followedAccountsUtils, 'setFollowedAccountsInLocalStorage');
    let state = { followedAccounts: {} };
    const store = { getState: () => state };

    followedAccounts(store);
    expect(followedAccountsUtils.setFollowedAccountsInLocalStorage).to.not.have.been.calledWith();

    state = { followedAccounts: { accounts: [] } };

    followedAccounts(store);
    expect(followedAccountsUtils.setFollowedAccountsInLocalStorage).to.have.been.calledWith([]);

    state = { followedAccounts: { accounts: [account, account2] } };

    followedAccounts(store);
    expect(followedAccountsUtils.setFollowedAccountsInLocalStorage)
      .to.have.been.calledWith(state.followedAccounts.accounts);

    followedAccountsUtils.setFollowedAccountsInLocalStorage.restore();
  });
});

