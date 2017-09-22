import i18next from 'i18next';
import actionTypes from '../../constants/actions';
import { successAlertDialogDisplayed } from '../../actions/dialog';
import { fromRawLsk } from '../../utils/lsk';
import transactionTypes from '../../constants/transactionTypes';

const addedTransactionMiddleware = store => next => (action) => {
  next(action);
  if (action.type === actionTypes.transactionAdded) {
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
  }
};

export default addedTransactionMiddleware;
