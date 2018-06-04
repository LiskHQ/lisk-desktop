import { getAccount, transactions as getTransactions } from '../../utils/api/account';
import { accountUpdated } from '../../actions/account';
import { transactionsUpdateUnconfirmed } from '../../actions/transactions';
import { activePeerUpdate } from '../../actions/peers';
import { votesFetched } from '../../actions/voting';
import actionTypes from '../../constants/actions';
import accountConfig from '../../constants/account';
import { getDelegate } from '../../utils/api/delegate';
import transactionTypes from '../../constants/transactionTypes';

const { lockDuration } = accountConfig;

const updateTransactions = (store, peers) => {
  const state = store.getState();
  const { filter } = state.transactions;
  const address = state.transactions.account
    ? state.transactions.account.address
    : state.account.address;

  getTransactions({
    activePeer: peers.data, address, limit: 25, filter,
  }).then((response) => {
    store.dispatch({
      data: {
        confirmed: response.transactions,
        count: parseInt(response.count, 10),
      },
      type: actionTypes.transactionsUpdated,
    });
    if (state.transactions.pending.length) {
      store.dispatch(transactionsUpdateUnconfirmed({
        activePeer: peers.data,
        address,
        pendingTransactions: state.transactions.pending,
      }));
    }
  });
};

const hasRecentTransactions = txs => (
  txs.confirmed.filter(tx => tx.confirmations < 1000).length !== 0 ||
  txs.pending.length !== 0
);

const updateAccountData = (store, action) => {
  const { peers, account, transactions } = store.getState();

  getAccount(peers.data, account.address).then((result) => {
    if (result.balance !== account.balance) {
      if (!action.data.windowIsFocused || !hasRecentTransactions(transactions)) {
        updateTransactions(store, peers, account);
      }
    }
    store.dispatch(accountUpdated(result));
    store.dispatch(activePeerUpdate({ online: true }));
  }).catch((res) => {
    store.dispatch(activePeerUpdate({ online: false, code: res.error.code }));
  });
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
    getDelegate(state.peers.data, { publicKey: state.account.publicKey })
      .then((delegateData) => {
        store.dispatch(accountUpdated(Object.assign(
          {},
          { delegate: delegateData.delegate, isDelegate: true },
        )));
      });
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
  if (!store.getState().account.passphrase) {
    store.dispatch(accountUpdated({
      passphrase: action.data,
      expireTime: Date.now() + lockDuration,
    }));
  } else {
    store.dispatch(accountUpdated({ expireTime: Date.now() + lockDuration }));
  }
};

const checkTransactionsAndUpdateAccount = (store, action) => {
  const state = store.getState();
  const { peers, account, transactions } = state;

  if (action.data.windowIsFocused && hasRecentTransactions(transactions)) {
    updateTransactions(store, peers, account);
  }

  const tx = action.data.block.transactions;
  const accountAddress = state.account.address;
  const blockContainsRelevantTransaction = tx.filter((transaction) => {
    const sender = transaction ? transaction.senderId : null;
    const recipient = transaction ? transaction.recipientId : null;
    return accountAddress === recipient || accountAddress === sender;
  }).length > 0;

  if (blockContainsRelevantTransaction) {
    updateAccountData(store, action);
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
