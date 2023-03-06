import { convertCommissionToNumber } from './getValidatorCommission';

export const checkCommissionValidity = (newCommission, oldCommission) => {
  const newCommissionParam = convertCommissionToNumber(newCommission);
  const oldCommissionParam = convertCommissionToNumber(oldCommission);

  const commissionDiff = Math.abs(newCommissionParam - oldCommissionParam);
  return commissionDiff <= 500;
};
