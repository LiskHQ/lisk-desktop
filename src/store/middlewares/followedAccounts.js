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
    const changedAccounts = followedAccounts.accounts.filter((account) => {
      const relevantTransactions = tx.filter((transaction) => {
        const { senderId, recipientId } = transaction;
        return (account.address === recipientId || account.address === senderId);
      });

      return relevantTransactions.length > 0;
    });

    updateFollowedAccounts(changedAccounts);
  };

  return next => (action) => {
    next(action);
    const { followedAccounts } = store.getState();
    switch (action.type) {
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
