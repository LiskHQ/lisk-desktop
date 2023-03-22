/* istanbul ignore file */
import { statusMessages } from '@transaction/configuration/statusConfig';
import { txStatusTypes } from '@transaction/configuration/txStatus';

const ChangeCommissionMessages = (t) => ({
  ...statusMessages(t),
  [txStatusTypes.broadcastSuccess]: {
    title: t('Edit commission successful'),
    message: t(
      'Your commission rate request has been successfully submitted, it will be reflected in your profile shortly.'
    ),
  },
});

export default ChangeCommissionMessages;
