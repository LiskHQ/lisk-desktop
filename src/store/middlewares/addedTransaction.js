import i18next from 'i18next';
import actionTypes from '../../constants/actions';
import { successAlertDialogDisplayed } from '../../actions/dialog';
import { fromRawLsk } from '../../utils/lsk';

const addedTransactionMiddleware = store => next => (action) => {
  next(action);
  if (action.type === actionTypes.transactionAdded) {
    let text;
    switch (action.data.type) {
      case 1:
        // second signature: 1
        text = i18next.t('Second passphrase registration was successfully submitted. It can take several seconds before it is processed.');
        break;
      case 2:
        // register as delegate: 2
        text = i18next.t('Delegate registration was successfully submitted with username: "{{username}}". It can take several seconds before it is processed.',
          { username: action.data.username });
        break;
      case 3:
        // Vote: 3
        text = i18next.t('Your votes were successfully submitted. It can take several seconds before they are processed.');
        break;
      default:
        // send: undefined
        text = i18next.t('Your transaction of {{amount}} LSK to {{recipientAddress}} was accepted and will be processed in a few seconds.',
          { amount: fromRawLsk(action.data.amount), recipientAddress: action.data.recipientId });
        break;
    }

    const newAction = successAlertDialogDisplayed({ text });
    store.dispatch(newAction);
  }
};

export default addedTransactionMiddleware;
