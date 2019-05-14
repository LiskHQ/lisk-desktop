import followedAccounts from './followedAccounts';
import * as followedAccountsUtils from '../../utils/followedAccounts';
import accounts from '../../../test/constants/accounts';

jest.mock('../../utils/followedAccounts');

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
    const state = { followedAccounts: { LSK: [account, account2], BTC: [] } };
    const store = { getState: () => state };

    followedAccounts(store);
    expect(followedAccountsUtils.setFollowedAccountsInLocalStorage)
      .toBeCalledWith(state.followedAccounts);
  });
});

