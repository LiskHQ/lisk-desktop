/* istanbul ignore file */
import { statusMessages } from '@transaction/detail/manager/transactionResult/statusConfig';
import { txStatusTypes } from '@transaction/configuration/txStatus';

const reclaimBalanceMessages = t => ({
  ...statusMessages(t),
  [txStatusTypes.broadcastSuccess]: {
    title: t('Balance reclaimed successfully'),
    message: t('Your legacy balance was deposited to your account.'),
  },
});

export default reclaimBalanceMessages;
