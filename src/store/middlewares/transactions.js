import i18next from 'i18next';

import { fromRawLsk } from '../../utils/lsk';
import { getUnconfirmedTransactions } from '../../utils/api/account';
import { successAlertDialogDisplayed } from '../../actions/dialog';
import { transactionsFailed } from '../../actions/transactions';
import actionTypes from '../../constants/actions';
import transactionTypes from '../../constants/transactionTypes';

const transactionAdded = (store, action) => {
  const texts = {
    [transactionTypes.setSecondPassphrase]: i18next.t('Second passphrase registration was successfully submitted. It can take several seconds before it is processed.'),
    [transactionTypes.registerDelegate]: i18next.t('Delegate registration was successfully submitted with username: "{{username}}". It can take several seconds before it is processed.',
      { username: action.data.username }),
    [transactionTypes.vote]: i18next.t('Your votes were successfully submitted. It can take several seconds before they are processed.'),
    [transactionTypes.send]: i18next.t('Your transaction of {{amount}} LSK to {{recipientAddress}} was accepted and will be processed in a few seconds.',
      { amount: fromRawLsk(action.data.amount), recipientAddress: action.data.recipientId }),
  };
  const text = texts[action.data.type];
  const newAction = successAlertDialogDisplayed({ text });
  store.dispatch(newAction);
};

const transactionsUpdated = (store) => {
  const { transactions, account, peers } = store.getState();
  if (transactions.pending.length) {
    getUnconfirmedTransactions(peers.data, account.address)
      .then(response => store.dispatch(transactionsFailed({
        failed: transactions.pending.filter(tx =>
          response.transactions.filter(unconfirmedTx => tx.id === unconfirmedTx.id).length === 0),
      })));
  }
};

const transactionsMiddleware = store => next => (action) => {
  next(action);
  switch (action.type) {
    case actionTypes.transactionAdded:
      transactionAdded(store, action);
      break;
    case actionTypes.transactionsUpdated:
      transactionsUpdated(store, action);
      break;
    default: break;
  }
};

export default transactionsMiddleware;
