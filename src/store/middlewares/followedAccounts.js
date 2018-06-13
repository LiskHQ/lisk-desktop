import actionTypes from '../../constants/actions';
import {
  followedAccountFetchedAndUpdated,
  followedAccountsRetrieved,
} from '../../actions/followedAccounts';
import { getFollowedAccountsFromLocalStorage } from '../../utils/followedAccounts';
import { extractAddress } from '../../utils/account';

const followedAccountsMiddleware = (store) => {
  setImmediate(() => {
    const accounts = getFollowedAccountsFromLocalStorage();
    store.dispatch(followedAccountsRetrieved(accounts));
  });

  const updateFollowedAccounts = (peers, accounts) => {
    accounts.forEach((account) => {
      store.dispatch(followedAccountFetchedAndUpdated({
        activePeer: peers.data,
        account,
      }));
    });
  };

  const checkTransactionsAndUpdateFollowedAccounts = (peers, tx, followedAccounts) => {
    const changedAccounts = followedAccounts.accounts.filter((account) => {
      const address = extractAddress(account.publicKey);

      const relevantTransactions = tx.filter((transaction) => {
        const { senderId, recipientId } = transaction;
        return (address === recipientId || address === senderId);
      });

      return relevantTransactions.length > 0;
    });

    updateFollowedAccounts(peers, changedAccounts);
  };

  return next => (action) => {
    next(action);
    const { peers, followedAccounts } = store.getState();
    switch (action.type) {
      case actionTypes.newBlockCreated:
        checkTransactionsAndUpdateFollowedAccounts(
          peers,
          action.data.block.transactions,
          followedAccounts,
        );
        break;
      case actionTypes.accountLoggedIn:
        updateFollowedAccounts(peers, followedAccounts.accounts);
        break;
      default:
        break;
    }
  };
};

export default followedAccountsMiddleware;
