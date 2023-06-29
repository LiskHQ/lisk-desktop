import { VALIDATOR_COMMISSION_DIVISOR } from '../consts/validators';

export const convertCommissionToPercentage = (val = 0) =>
  Math.abs(val / VALIDATOR_COMMISSION_DIVISOR).toFixed(2);
export const convertCommissionToNumber = (val = '0') => {
  const floatString = parseFloat(val).toFixed(2);
  return parseFloat(floatString.replace('.', ''))
};
