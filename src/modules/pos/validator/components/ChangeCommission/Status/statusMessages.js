/* istanbul ignore file */
import { statusMessages } from '@transaction/configuration/statusConfig';
import { txStatusTypes } from '@transaction/configuration/txStatus';

const ChangeCommissionMessages = (t) => ({
  ...statusMessages(t),
  [txStatusTypes.broadcastSuccess]: {
    title: t('Change Commission succeeded'),
    message: t('View your validator profile.'),
  },
});

export default ChangeCommissionMessages;
