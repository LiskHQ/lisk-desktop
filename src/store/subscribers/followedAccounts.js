import { setFollowedAccountsInLocalStorage } from '../../utils/followedAccounts';

const followedAccountsSubscriber = (store) => {
  const { followedAccounts } = store.getState();
  setFollowedAccountsInLocalStorage(followedAccounts.accounts);
};

export default followedAccountsSubscriber;
