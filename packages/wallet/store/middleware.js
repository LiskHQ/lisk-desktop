import { toast } from 'react-toastify';
import networks, { networkKeys } from '@network/configuration/networks';
import { timeOutId, timeOutWarningId } from '@views/configuration';
import { tokenMap } from '@token/fungible/consts/tokens';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { fromRawLsk, delay } from '@token/fungible/utils/lsk';
import { getActiveTokenAccount } from '@wallet/utilities/account';
import {
  settingsUpdated, networkSelected, networkStatusUpdated, accountDataUpdated,
  emptyTransactionsData, transactionsRetrieved, votesRetrieved,
} from '@common/store/actions';
import analytics from '@common/utilities/analytics';
import { getTransactions } from '@transaction/api';
import i18n from '@setup/i18n/i18n';
import blockActionTypes from '@block/store/actionTypes';
import transactionActionTypes from '@transaction/store/actionTypes';
import settingsActionTypes from '@settings/store/actionTypes';
import actionTypes from './actionTypes';

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

const filterIncomingTransactions = (transactions, account) =>
  transactions.filter(transaction => (
    transaction
    && transaction.moduleAssetId === MODULE_ASSETS_NAME_ID_MAP.transfer
    && transaction.asset.recipient?.address === account.summary?.address
  ));

const showNotificationsForIncomingTransactions = (transactions, account, token) => {
  filterIncomingTransactions(transactions, account).forEach((transaction) => {
    const amount = fromRawLsk(transaction.asset.amount);
    if (amount > 0) {
      const message = transaction.asset.data
        ? i18n.t('with message {{message}}', { message: transaction.asset.data })
        : '';
      // eslint-disable-next-line no-new
      new Notification(i18n.t('{{amount}} {{token}} Received', { amount, token }), {
        body: i18n.t('Your account just received {{amount}} {{token}} {{message}}', { amount, token, message }),
      });
    }
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
        account.summary?.address && (account.summary?.address === transaction.sender.address
        || account.summary?.address === transaction.asset?.recipient?.address)
      );
    }).length > 0;
    showNotificationsForIncomingTransactions(txs, account, token.active);
    const recentBtcTransaction = token.active === tokenMap.BTC.key
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

const readStoredNetwork = ({ dispatch, getState }) => {
  const {
    statistics, statisticsRequest, statisticsFollowingDay, network,
  } = getState().settings;

  const config = network?.name && network.address
    ? network
    : {
      name: networkKeys.mainNet,
      address: networks.mainnet.serviceUrl,
    };
  dispatch(networkSelected(config));
  dispatch(networkStatusUpdated({ online: true }));

  if (!statistics) {
    analytics.checkIfAnalyticsShouldBeDisplayed({
      statisticsRequest, statisticsFollowingDay, statistics,
    });
  }
};

// eslint-disable-next-line complexity
const accountMiddleware = store => next => async (action) => {
  next(action);
  switch (action.type) {
    case settingsActionTypes.settingsRetrieved:
      readStoredNetwork(store);
      break;
    case blockActionTypes.newBlockCreated:
      await checkTransactionsAndUpdateAccount(store, action);
      break;
    case transactionActionTypes.transactionsRetrieved:
      votePlaced(store, action);
      break;
    case actionTypes.accountUpdated:
    case actionTypes.accountLoggedIn: {
      toast.dismiss(timeOutId);
      toast.dismiss(timeOutWarningId);
      break;
    }
    case actionTypes.accountLoggedOut:
      /* Reset active token setting so in case BTC is selected,
      the Lisk monitoring features are available and Lisk is selected on the next login */
      store.dispatch(settingsUpdated({ token: { active: tokenMap.LSK.key } }));
      store.dispatch(emptyTransactionsData());
      break;
    case settingsActionTypes.settingsUpdated:
      if (action.data.token && store.getState().wallet.info) {
        store.dispatch(accountDataUpdated('enabled'));
      }
      break;
    default: break;
  }
};

export default accountMiddleware;
