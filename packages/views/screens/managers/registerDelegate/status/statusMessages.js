/* istanbul ignore file */
import { statusMessages } from '@shared/transactionResult/statusConfig';
import { txStatusTypes } from '@common/configuration';

const registerDelegatesMessages = t => ({
  ...statusMessages(t),
  [txStatusTypes.broadcastSuccess]: {
    title: t('Delegate registration succeeded'),
    message: t('View your delegate profile in the wallet page.'),
  },
});

export default registerDelegatesMessages;
