/* istanbul ignore file */
import { statusMessages, txStatusTypes } from '@shared/transactionResult/statusConfig';

const registerDelegatesMessages = t => ({
  ...statusMessages(t),
  [txStatusTypes.broadcastSuccess]: {
    title: t('Delegate registration succeeded'),
    message: t('View your delegate profile in the wallet page.'),
  },
});

export default registerDelegatesMessages;
