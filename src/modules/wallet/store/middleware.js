import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import { fromRawLsk, delay } from '@token/fungible/utils/lsk';
import { selectActiveToken, selectActiveTokenAccount } from '@common/store/selectors';
import {
  accountDataUpdated,
  emptyTransactionsData,
  transactionsRetrieved,
} from '@common/store/actions';
import { getTransactions } from '@transaction/api';
import i18n from 'src/utils/i18n/i18n';
import blockActionTypes from '@block/store/actionTypes';
import settingsActionTypes from 'src/modules/settings/store/actionTypes';
import actionTypes from './actionTypes';

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
  const { transactions, network } = state;
  const account = selectActiveTokenAccount(state);
  const activeToken = selectActiveToken(state);
  const { numberOfTransactions, id } = action.data.block;

  if (numberOfTransactions) {
    await delay();
    const res = await getTransactions({
      network,
      params: { blockId: id },
    });
    const { data: txs } = res;
    const blockContainsRelevantTransaction = txs.filter((transaction) => {
      if (!transaction) return false;
      return (
        account.summary?.address && (account.summary?.address === transaction.sender.address
        || account.summary?.address === transaction.asset?.recipient?.address)
      );
    }).length > 0;
    showNotificationsForIncomingTransactions(txs, account, activeToken);

    if (blockContainsRelevantTransaction) {
      store.dispatch(accountDataUpdated());
      store.dispatch(transactionsRetrieved({
        address: account.summary?.address,
        filters: transactions.filters,
      }));
    }
  }
};

const accountMiddleware = store => next => async (action) => {
  next(action);
  // @todo Update token storage when new token management system is ready
  switch (action.type) {
    case blockActionTypes.newBlockCreated:
      await checkTransactionsAndUpdateAccount(store, action);
      break;
    case actionTypes.accountLoggedOut:
      store.dispatch(emptyTransactionsData());
      break;
    case settingsActionTypes.settingsUpdated:
      if (action.data.token && store.getState().wallet.info) {
        store.dispatch(accountDataUpdated('enabled'));
      }
      break;
    default:
      break;
  }
};

export default accountMiddleware;
