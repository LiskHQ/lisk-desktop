import actionTypes from '../../constants/actions';
import { followedAccountFetchedAndUpdated } from '../../actions/followedAccounts';

const followedAccountsMiddleware = (store) => {
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
      const relevantTransactions = tx.filter((transaction) => {
        const { senderId, recipientId } = transaction;
        return (account.address === recipientId || account.address === senderId);
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
          action.data.block.transactions || [],
          followedAccounts,
        );
        break;
      case actionTypes.followedAccountAdded:
        store.dispatch(followedAccountFetchedAndUpdated({
          activePeer: peers.data,
          account: action.data,
        }));
        break;
      case actionTypes.activePeerSet:
        updateFollowedAccounts(peers, followedAccounts.accounts);
        break;
      default:
        break;
    }
  };
};

export default followedAccountsMiddleware;
