/* istanbul ignore file */
import { statusMessages } from '@transaction/configuration/statusConfig';
import { txStatusTypes } from '@transaction/configuration/txStatus';

const reclaimBalanceMessages = t => ({
  ...statusMessages(t),
  [txStatusTypes.broadcastSuccess]: {
    title: t('Reclaimed LSK tokens'),
    message: t('Your balance will be transfered in a few seconds.'),
  },
  [txStatusTypes.broadcastError]: {
    title: t('Reclaim LSK tokens failed'),
    message: t(
      'Your LSK tokens could not be reclaimed, you can try again or report to us via email'
    ),
  },
});

export default reclaimBalanceMessages;
