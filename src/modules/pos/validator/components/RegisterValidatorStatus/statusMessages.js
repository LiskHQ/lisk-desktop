/* istanbul ignore file */
import { statusMessages } from '@transaction/configuration/statusConfig';
import { txStatusTypes } from '@transaction/configuration/txStatus';

const registerValidatorsMessages = (t) => ({
  ...statusMessages(t),
  [txStatusTypes.broadcastSuccess]: {
    title: t('Validator registration succeeded'),
    message: t('You will be notified when your transaction is confirmed.'),
  },
});

export default registerValidatorsMessages;
