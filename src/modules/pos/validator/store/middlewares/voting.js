import walletActionTypes from '@wallet/store/actionTypes';
import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import transactionActionTypes from '@transaction/store/actionTypes';
import { votesRetrieved } from '../actions/voting';

const getRecentTransactionOfType = (transactionsList, type) => (
  transactionsList.filter(transaction => (
    transaction.type === type
    // limit the number of confirmations to 5 to not fire each time there is another new transaction
    // theoretically even less then 5, but just to be on the safe side
    && transaction.confirmations < 5))[0]
);

const votePlaced = (store, action) => {
  const voteTransaction = getRecentTransactionOfType(
    action.data.confirmed,
    MODULE_COMMANDS_NAME_MAP.voteDelegate,
  );

  if (voteTransaction) {
    store.dispatch(votesRetrieved());
  }
};

const votingMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case walletActionTypes.accountUpdated:
      store.dispatch(votesRetrieved());
      break;
    case transactionActionTypes.transactionsRetrieved:
      votePlaced(store, action);
      break;
    default: break;
  }
};

export default votingMiddleware;
