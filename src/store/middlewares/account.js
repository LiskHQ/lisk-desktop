import { accountUpdated,
  accountDataUpdated,
  updateTransactionsIfNeeded,
  updateDelegateAccount,
} from '../../actions/account';
import { votesFetched } from '../../actions/voting';
import actionTypes from '../../constants/actions';
import accountConfig from '../../constants/account';
import transactionTypes from '../../constants/transactionTypes';

const { lockDuration } = accountConfig;

const updateAccountData = (store, action) => {
  const { peers, account, transactions } = store.getState();

  store.dispatch(accountDataUpdated({
    windowIsFocused: action.data.windowIsFocused,
    transactions,
    account,
    peers,
  }));
};

const getRecentTransactionOfType = (transactionsList, type) => (
  transactionsList.filter(transaction => (
    transaction.type === type &&
    // limit the number of confirmations to 5 to not fire each time there is another new transaction
    // theoretically even less then 5, but just to be on the safe side
    transaction.confirmations < 5))[0]
);

const delegateRegistration = (store, action) => {
  const delegateRegistrationTx = getRecentTransactionOfType(
    action.data.confirmed,
    transactionTypes.registerDelegate,
  );
  const state = store.getState();

  if (delegateRegistrationTx) {
    store.dispatch(updateDelegateAccount({
      activePeer: state.peers.data,
      publicKey: state.account.publicKey,
    }));
  }
};

const votePlaced = (store, action) => {
  const voteTransaction = getRecentTransactionOfType(action.data.confirmed, transactionTypes.vote);

  if (voteTransaction) {
    const state = store.getState();
    const { peers, account } = state;

    store.dispatch(votesFetched({
      activePeer: peers.data,
      address: account.address,
      type: 'update',
    }));
  }
};

const passphraseUsed = (store, action) => {
  const data = { expireTime: Date.now() + lockDuration };

  if (!store.getState().account.passphrase) {
    data.passphrase = action.data;
  }

  store.dispatch(accountUpdated(data));
};

const checkTransactionsAndUpdateAccount = (store, action) => {
  const state = store.getState();
  const { peers, account, transactions } = state;

  store.dispatch(updateTransactionsIfNeeded(
    {
      transactions,
      activePeer: peers.data,
      account,
    },
    action.data.windowIsFocused,
  ));

  const tx = action.data.block.transactions || [];
  const accountAddress = state.account.address;
  const blockContainsRelevantTransaction = tx.filter((transaction) => {
    const sender = transaction ? transaction.senderId : null;
    const recipient = transaction ? transaction.recipientId : null;
    return accountAddress === recipient || accountAddress === sender;
  }).length > 0;

  if (blockContainsRelevantTransaction) {
    setTimeout(() => {
      updateAccountData(store, action);
    }, 5000);
  }
};

const accountMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    // update on login because the 'save account' button
    // depends on a rerendering of the page
    // TODO: fix the 'save account' path problem, so we can remove this
    case actionTypes.accountLoggedIn:
      updateAccountData(store, action);
      break;
    case actionTypes.newBlockCreated:
      checkTransactionsAndUpdateAccount(store, action);
      break;
    case actionTypes.transactionsUpdated:
      delegateRegistration(store, action);
      votePlaced(store, action);
      break;
    case actionTypes.passphraseUsed:
      passphraseUsed(store, action);
      break;
    default: break;
  }
};

export default accountMiddleware;
