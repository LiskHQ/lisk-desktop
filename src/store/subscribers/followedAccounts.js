import { setFollowedAccountsInLocalStorage } from '../../utils/followedAccounts';

const followedAccountsSubscriber = (store) => {
  const { followedAccounts } = store.getState();
  if (followedAccounts.accounts) {
    setFollowedAccountsInLocalStorage(followedAccounts.accounts);
  }
};

export default followedAccountsSubscriber;
