import { setSavedAccounts, setLastActiveAccount } from '../../utils/savedAccounts';

const savedAccountsSubscriber = (store) => {
  const { savedAccounts } = store.getState();
  if (savedAccounts && savedAccounts.lastActive) {
    setSavedAccounts(savedAccounts.accounts);
    setLastActiveAccount(savedAccounts.lastActive);
  }
};

export default savedAccountsSubscriber;
