import {
  accountDataUpdated,
  updateEnabledTokenAccount,
  login,
} from '../../actions/account';
import {
  emptyTransactionsData,
  updateTransactions,
} from '../../actions/transactions';
import { settingsUpdated } from '../../actions/settings';
import { fromRawLsk } from '../../utils/lsk';
import { getActiveTokenAccount, hasEnoughBalanceForInitialization } from '../../utils/account';
import { getAutoLogInData, shouldAutoLogIn } from '../../utils/login';
import { loadVotes } from '../../actions/voting';
import actionTypes from '../../constants/actions';
import analytics from '../../utils/analytics';
import i18n from '../../i18n';
import settings from '../../constants/settings';
import transactionTypes from '../../constants/transactionTypes';
import { txAdapter } from '../../utils/api/lsk/adapters';
import { tokenMap } from '../../constants/tokens';
import { removeSearchParamsFromUrl, selectSearchParamValue } from '../../utils/searchParams';
import history from '../../history';
import routes from '../../constants/routes';

const updateAccountData = (store) => {
  const { transactions } = store.getState();
  const account = getActiveTokenAccount(store.getState());

  store.dispatch(accountDataUpdated({
    transactions,
    account,
  }));
};

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
    transactionTypes().vote.code,
  );

  if (voteTransaction) {
    const { account } = store.getState();

    store.dispatch(loadVotes({
      address: account.info.LSK.address,
      type: 'update',
    }));
  }
};

const filterIncomingTransactions = (transactions, account) => transactions.filter(transaction => (
  transaction
  && transaction.recipientId === account.address
  && transaction.type === transactionTypes().send.code
));

const showNotificationsForIncomingTransactions = (transactions, account, token) => {
  filterIncomingTransactions(transactions, account).forEach((transaction) => {
    const amount = fromRawLsk(transaction.amount);
    const message = transaction.asset && transaction.asset.data
      ? i18n.t('with message {{message}}', { message: transaction.asset.data })
      : '';
    // eslint-disable-next-line no-new
    new Notification(i18n.t('{{amount}} {{token}} Received', { amount, token }), {
      body: i18n.t('Your account just received {{amount}} {{token}} {{message}}', { amount, token, message }),
    });
  });
};

// eslint-disable-next-line max-statements
const checkTransactionsAndUpdateAccount = (store, action) => {
  const state = store.getState();
  const { transactions, settings: { token } } = state;
  const account = getActiveTokenAccount(store.getState());

  const txs = (action.data.block.transactions || []).map(txAdapter);
  const relevantTransactions = txs.filter((transaction) => {
    const sender = transaction ? transaction.senderId : null;
    const recipient = transaction ? transaction.recipientId : null;
    return account.address === recipient || account.address === sender;
  });

  const blockContainsRelevantTransaction = relevantTransactions.length > 0;

  showNotificationsForIncomingTransactions(txs, account, token.active);

  const recentBtcTransaction = token.active === 'BTC'
    && transactions.confirmed.filter(t => t.confirmations === 1).length > 0;

  if (blockContainsRelevantTransaction || recentBtcTransaction) {
    // it was not getting the account with secondPublicKey right
    // after a new block with second passphrase registration transaction was received
    // Adding timeout explained in
    // https://github.com/LiskHQ/lisk-desktop/pull/1609
    // eslint-disable-next-line max-statements
    setTimeout(() => {
      updateAccountData(store);
      store.dispatch(updateTransactions({
        pendingTransactions: transactions.pending,
        address: account.address,
        filters: transactions.filters,
      }));
    }, 500);
  }
};

// eslint-disable-next-line max-statements
const autoLogInIfNecessary = async (store) => {
  const {
    statistics, statisticsRequest, statisticsFollowingDay,
  } = store.getState().settings;

  const autologinData = getAutoLogInData();
  if (shouldAutoLogIn(autologinData)) {
    setTimeout(() => {
      store.dispatch(login({ passphrase: autologinData[settings.keys.loginKey] }));
    }, 500);
  }

  if (!statistics) {
    analytics.checkIfAnalyticsShouldBeDisplayed({
      statisticsRequest, statisticsFollowingDay, statistics,
    });
  }
};

// eslint-disable-next-line max-statements
const checkAccountInitializationState = (action) => {
  const search = window.location.href.split('?')[1];

  const initialization = selectSearchParamValue(search, 'initialization');
  let serverPublicKey = '';
  let balance = 0;
  let redirectUrl = '';

  if (action.type === actionTypes.accountLoggedIn) {
    serverPublicKey = action.data.info.LSK.serverPublicKey;
    balance = action.data.info.LSK.balance;
    redirectUrl = routes.initialization.path;
  } else if (action.type === actionTypes.accountUpdated) {
    serverPublicKey = action.data.serverPublicKey;
    balance = action.data.balance;
    redirectUrl = `${routes.wallet.path}?modal=send&initialization=true`;
  }

  if (serverPublicKey) {
    if (initialization) {
      history.push(routes.wallet.path);
      removeSearchParamsFromUrl(history, ['modal', 'initialization']);
    }
  } else if (hasEnoughBalanceForInitialization(balance)) {
    history.push(redirectUrl);
  }
};

// eslint-disable-next-line complexity
const accountMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.settingsRetrieved:
      autoLogInIfNecessary(store);
      break;
    case actionTypes.newBlockCreated:
      checkTransactionsAndUpdateAccount(store, action);
      break;
    case actionTypes.updateTransactions:
      votePlaced(store, action);
      break;
    case actionTypes.accountUpdated:
    case actionTypes.accountLoggedIn: {
      checkAccountInitializationState(action);
      break;
    }
    case actionTypes.accountLoggedOut:
      /* Reset active token setting so in case BTC is selected,
      the Lisk monitoring features are available and Lisk is selected on the next login */
      store.dispatch(settingsUpdated({ token: { active: tokenMap.LSK.key } }));
      store.dispatch(emptyTransactionsData());
      break;
    case actionTypes.settingsUpdated: {
      const tokensList = action.data.token && action.data.token.list;
      const token = tokensList && Object.keys(tokensList)
        .find(t => tokensList[t]);
      if (tokensList && tokensList[token]) {
        store.dispatch(updateEnabledTokenAccount(token));
      }
      break;
    }
    /* istanbul ignore next */
    default: break;
  }
};

export default accountMiddleware;
