/* istanbul ignore file */
import { statusMessages } from '@transaction/configuration/statusConfig';
import { txStatusTypes } from '@transaction/configuration/txStatus';

const registerValidatorsMessages = t => ({
  ...statusMessages(t),
  [txStatusTypes.broadcastSuccess]: {
    title: t('Validator registration succeeded'),
    message: t('View your validator profile in the wallet page.'),
  },
});

export default registerValidatorsMessages;
