import {
  accountDataUpdated,
  updateEnabledTokenAccount,
  login,
} from '../../actions/account';
import {
  emptyTransactionsData,
  transactionsRetrieved,
} from '../../actions/transactions';
import { settingsUpdated } from '../../actions/settings';
import { fromRawLsk } from '../../utils/lsk';
import { getActiveTokenAccount } from '../../utils/account';
import { getAutoLogInData, shouldAutoLogIn } from '../../utils/login';
import { votesRetrieved } from '../../actions/voting';
import { networkSelected, networkStatusUpdated } from '../../actions/network';
import actionTypes from '../../constants/actions';
import analytics from '../../utils/analytics';
import i18n from '../../i18n';
import networks, { networkKeys } from '../../constants/networks';
import settings from '../../constants/settings';
import transactionTypes from '../../constants/transactionTypes';
import { tokenMap } from '../../constants/tokens';
import { getTransactions } from '../../utils/api/transaction';

const updateAccountData = (store) => {
  const account = getActiveTokenAccount(store.getState());

  store.dispatch(accountDataUpdated({ account }));
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
    transactionTypes().vote.code.legacy,
  );

  if (voteTransaction) {
    store.dispatch(votesRetrieved());
  }
};

const filterIncomingTransactions = (transactions, account) => transactions.filter(transaction => (
  transaction
  && transaction.recipientId === account.address
  && transaction.type === transactionTypes().transfer.code.legacy
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
const checkTransactionsAndUpdateAccount = async (store, action) => {
  const state = store.getState();
  const { transactions, settings: { token }, network } = state;
  const account = getActiveTokenAccount(store.getState());
  const { numberOfTransactions, id } = action.data.block;

  if (numberOfTransactions) {
    const { data: txs } = await getTransactions({ network, params: { blockId: id } }, token);
    const blockContainsRelevantTransaction = txs.filter((transaction) => {
      if (!transaction) return false;
      return (
        account.address === transaction.senderId
        || account.address === transaction.recipientId
      );
    }).length > 0;

    showNotificationsForIncomingTransactions(txs, account, token.active);
    const recentBtcTransaction = token.active === 'BTC'
      && transactions.confirmed.filter(t => t.confirmations === 1).length > 0;

    if (blockContainsRelevantTransaction || recentBtcTransaction) {
      // it was not getting the account with secondPublicKey right
      // after a new block with second passphrase registration transaction was received
      // Adding timeout explained in
      // https://github.com/LiskHQ/lisk-desktop/pull/1609
      setTimeout(() => {
        updateAccountData(store);
        store.dispatch(transactionsRetrieved({
          address: account.address,
          filters: transactions.filters,
        }));
      }, 500);
    }
  }
};

const autoLogInIfNecessary = async ({ dispatch, getState }) => {
  const {
    statistics, statisticsRequest, statisticsFollowingDay,
  } = getState().settings;
  const autoLoginData = getAutoLogInData();

  const address = autoLoginData[settings.keys.liskCoreUrl];
  const network = address
    ? { name: networkKeys.customNode, address }
    : { name: networkKeys.mainNet, address: networks.mainnet.nodes[0] };
  dispatch(networkSelected(network));
  dispatch(networkStatusUpdated({ online: true }));

  if (shouldAutoLogIn(autoLoginData)) {
    setTimeout(() => {
      dispatch(login({ passphrase: autoLoginData[settings.keys.loginKey] }));
    }, 500);
  }

  if (!statistics) {
    analytics.checkIfAnalyticsShouldBeDisplayed({
      statisticsRequest, statisticsFollowingDay, statistics,
    });
  }
};

const accountMiddleware = store => next => async (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.storeCreated:
      autoLogInIfNecessary(store);
      break;
    case actionTypes.newBlockCreated:
      await checkTransactionsAndUpdateAccount(store, action);
      break;
    case actionTypes.transactionsRetrieved:
      votePlaced(store, action);
      break;
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
