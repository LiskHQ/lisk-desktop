import {
  networks, actionTypes, networkKeys, settings, MODULE_ASSETS_NAME_ID_MAP, tokenMap, routes,
} from '@constants';
import { fromRawLsk } from '@utils/lsk';
import { getActiveTokenAccount } from '@utils/account';
import { getAutoLogInData } from '@utils/login';
import {
  settingsUpdated, networkSelected, networkStatusUpdated, accountDataUpdated,
  emptyTransactionsData, transactionsRetrieved, votesRetrieved,
} from '@actions';
import analytics from '@utils/analytics';
import { getTransactions } from '@api/transaction';
import i18n from '../../i18n';
import history from '../../history';

/**
 * After a new block is created and broadcasted
 * it takes a few ms for Lisk Service
 * to update transactions index, so we need to wait
 * before retrieving the the transaction by blockId
 *
 * @returns {Promise} resolves with True after 100ms
 */
const delay = () => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 1500);
});

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
    MODULE_ASSETS_NAME_ID_MAP.voteDelegate,
  );

  if (voteTransaction) {
    store.dispatch(votesRetrieved());
  }
};

const filterIncomingTransactions = (transactions, account) => transactions.filter(transaction => (
  transaction
  && transaction.recipientId === account.summary?.address
  && transaction.type === MODULE_ASSETS_NAME_ID_MAP.transfer
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
    await delay();
    const { data: txs } = await getTransactions({
      network,
      params: { blockId: id },
    }, token.active);

    const blockContainsRelevantTransaction = txs.filter((transaction) => {
      if (!transaction) return false;
      return (
        account.summary?.address === transaction.sender.address
        || account.summary?.address === transaction.asset?.recipient.address
      );
    }).length > 0;

    showNotificationsForIncomingTransactions(txs, account, token.active);
    const recentBtcTransaction = token.active === 'BTC'
      && transactions.confirmed.filter(t => t.confirmations === 1).length > 0;

    if (blockContainsRelevantTransaction || recentBtcTransaction) {
      store.dispatch(accountDataUpdated());
      store.dispatch(transactionsRetrieved({
        address: account.summary?.address,
        filters: transactions.filters,
      }));
    }
  }
};

const autoLogInIfNecessary = async ({ dispatch, getState }) => {
  const {
    statistics, statisticsRequest, statisticsFollowingDay,
  } = getState().settings;
  const autoLoginData = getAutoLogInData();

  const address = autoLoginData[settings.keys.liskServiceUrl];
  const network = address
    ? { name: networkKeys.customNode, address }
    : { name: networkKeys.mainNet, address: networks.mainnet.serviceUrl };
  dispatch(networkSelected(network));
  dispatch(networkStatusUpdated({ online: true }));

  if (!statistics) {
    analytics.checkIfAnalyticsShouldBeDisplayed({
      statisticsRequest, statisticsFollowingDay, statistics,
    });
  }
};

const checkAccountInitializationState = (action) => {
  if (action.type === actionTypes.accountLoggedIn) {
    const { isMigrated } = action.data.info.LSK.summary;
    if (isMigrated === false) { // we need to check against false, check against falsy won't work
      history.push(routes.reclaim.path);
    }
  }
};

// eslint-disable-next-line complexity
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
    case actionTypes.settingsUpdated:
      if (action.data.token) {
        store.dispatch(accountDataUpdated('enabled'));
      }
      break;
    /* istanbul ignore next */
    default: break;
  }
};

export default accountMiddleware;
