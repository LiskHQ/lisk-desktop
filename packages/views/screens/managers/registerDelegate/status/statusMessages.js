/* istanbul ignore file */
import { statusMessages } from '@transaction/detail/info/transactionResult/statusConfig';
import { txStatusTypes } from '@transaction/configuration/txStatus';

const registerDelegatesMessages = t => ({
  ...statusMessages(t),
  [txStatusTypes.broadcastSuccess]: {
    title: t('Delegate registration succeeded'),
    message: t('View your delegate profile in the wallet page.'),
  },
});

export default registerDelegatesMessages;
