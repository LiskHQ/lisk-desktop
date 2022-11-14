import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import { formatAmountBasedOnLocale } from 'src/utils/formattedNumber';

const getTxDirectionConfig = (moduleCommand, host, recipient, styles) => {
  if (
    moduleCommand === MODULE_COMMANDS_NAME_MAP.unlock ||
    moduleCommand === MODULE_COMMANDS_NAME_MAP.reclaim
  ) {
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
  return !fee.error ? `${formatAmountBasedOnLocale({ value: fee.value })} ${token}` : fee.feedback;
};

export default getTxDirectionConfig;

export const trimBigintString = (data) => {
  const result = Array.isArray(data) ? [] : {};
  const objectKeys = Object.keys(data);

  objectKeys.forEach((key) => {
    const value = data[key];
    const isObject = typeof value === 'object' && !Array.isArray(value);
    const isArray = Array.isArray(value);
    const isBigIntString = typeof value === 'string' && parseInt(value, 10);

    result[key] = value;

    if (isObject || isArray) {
      result[key] = trimBigintString(value);
    } else if (isBigIntString) {
      result[key] = result[key].replace(/n$/, '');
    }
  });

  return result;
};
