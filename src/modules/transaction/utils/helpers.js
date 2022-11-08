import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import {
  formatAmountBasedOnLocale,
} from 'src/utils/formattedNumber';

const getTxDirectionConfig = (moduleCommand, host, recipient, styles) => {
  if (moduleCommand === MODULE_COMMANDS_NAME_MAP.unlock
      || moduleCommand === MODULE_COMMANDS_NAME_MAP.reclaim) {
    return {
      sign: '',
      style: styles.unlock,
    };
  }
  if (moduleCommand === MODULE_COMMANDS_NAME_MAP.transfer && host === recipient) {
    return {
      sign: '',
      style: styles.receive,
    };
  }
  if (moduleCommand === MODULE_COMMANDS_NAME_MAP.transfer) {
    return {
      sign: '- ',
      style: '',
    };
  }
  return false;
};

export const getFeeStatus = ({ fee, token, customFee }) => {
  if (customFee) {
    return customFee;
  }
  return !fee.error
    ? `${formatAmountBasedOnLocale({ value: fee.value })} ${token}`
    : fee.feedback;
};

export const getSpaceSeparated = str => str.replace(/([A-Z])/g, ' $1');

export default getTxDirectionConfig;
