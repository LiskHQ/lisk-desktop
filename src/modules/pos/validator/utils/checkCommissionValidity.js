import { convertCommissionToNumber } from './getValidatorCommission';
import { MAX_COMMISSION_INCREASE_RATE } from '../consts';

export const checkCommissionValidity = (newCommission, oldCommission) => {
  const newCommissionParam = convertCommissionToNumber(newCommission);
  const oldCommissionParam = convertCommissionToNumber(oldCommission);

  if (newCommissionParam < oldCommissionParam) {
    return true;
  }
  const commissionIncrease = newCommissionParam - oldCommissionParam;
  return commissionIncrease <= MAX_COMMISSION_INCREASE_RATE;
};

export const isCommissionIncrease = (newCommission, oldCommission) => {
  const newCommissionParam = convertCommissionToNumber(newCommission);
  const oldCommissionParam = convertCommissionToNumber(oldCommission);

  return newCommissionParam > oldCommissionParam;
};
