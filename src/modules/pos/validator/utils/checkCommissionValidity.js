import { convertCommissionToNumber } from './getValidatorCommission';

export const checkCommissionValidity = (newCommission, oldCommission) => {
  const newCommissionParam = convertCommissionToNumber(newCommission);
  const oldCommissionParam = convertCommissionToNumber(oldCommission);

  if (newCommissionParam < oldCommissionParam) {
    return true;
  }
  const commissionIncrease = newCommissionParam - oldCommissionParam;
  return commissionIncrease <= 500;
};
