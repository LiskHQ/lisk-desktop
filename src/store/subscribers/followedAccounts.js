import { setFollowedAccountsInLocalStorage } from '../../utils/followedAccounts';

const followedAccountsSubscriber = (store) => {
  const { followedAccounts } = store.getState();
  setFollowedAccountsInLocalStorage(followedAccounts);
};

export default followedAccountsSubscriber;
