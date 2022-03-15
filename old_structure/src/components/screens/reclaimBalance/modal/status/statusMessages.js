/* istanbul ignore file */
import { statusMessages } from '@shared/transactionResult/statusConfig';
import { txStatusTypes } from '@constants';

const reclaimBalanceMessages = t => ({
  ...statusMessages(t),
  [txStatusTypes.broadcastSuccess]: {
    title: t('Balance reclaimed successfully'),
    message: t('Your legacy balance was deposited to your account.'),
  },
});

export default reclaimBalanceMessages;
