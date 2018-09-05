import actionTypes from '../../constants/actions';
import { followedAccountFetchedAndUpdated } from '../../actions/followedAccounts';

const followedAccountsMiddleware = (store) => {
  const updateFollowedAccounts = (accounts) => {
    accounts.forEach((account) => {
      store.dispatch(followedAccountFetchedAndUpdated({
        account,
      }));
    });
  };

  const checkTransactionsAndUpdateFollowedAccounts = (tx, followedAccounts) => {
    const loggedAccount = store.getState().account;
    let loggedAccountFollowed;
    const changedAccounts = followedAccounts.accounts.filter((account) => {
      const relevantTransactions = tx.filter((transaction) => {
        const { senderId, recipientId } = transaction;
        loggedAccountFollowed = (loggedAccount.address === senderId
          || loggedAccount.address === recipientId) ? account : null;
        return (account.address === senderId || account.address === recipientId);
      });

      return relevantTransactions.length > 0;
    });

    if (loggedAccountFollowed) {
      changedAccounts.push(loggedAccountFollowed);
    }

    updateFollowedAccounts(changedAccounts);
  };

  const updateFollowedAccountsOnTransactionUpdated = (action, transactions, followedAccounts) => {
    const lengthIndex = action.data.confirmed.length - 1;
    if (transactions.confirmed[lengthIndex].id !== action.data.confirmed[lengthIndex].id) {
      checkTransactionsAndUpdateFollowedAccounts(
        [action.data.confirmed[0]],
        followedAccounts,
      );
    }
  };

  return next => (action) => {
    next(action);
    const { followedAccounts, transactions } = store.getState();
    switch (action.type) {
      case actionTypes.transactionsUpdated:
        updateFollowedAccountsOnTransactionUpdated(action, transactions, followedAccounts);
        break;
      case actionTypes.newBlockCreated:
        checkTransactionsAndUpdateFollowedAccounts(
          action.data.block.transactions || [],
          followedAccounts,
        );
        break;
      case actionTypes.followedAccountAdded:
        store.dispatch(followedAccountFetchedAndUpdated({
          account: action.data,
        }));
        break;
      case actionTypes.activePeerSet:
        updateFollowedAccounts(followedAccounts.accounts);
        break;
      default:
        break;
    }
  };
};

export default followedAccountsMiddleware;
