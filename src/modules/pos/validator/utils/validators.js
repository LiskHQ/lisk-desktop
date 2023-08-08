/* eslint-disable import/prefer-default-export */
import { regex } from 'src/const/regex';

/**
 * Validates give values with the criteria of
 * 1. generatorKey or
 * 2. blsKey or
 * 3. proofOfPossession
 */
export const validatorKeyValidator = (key, value) => {
  if (typeof value !== 'string' || !regex[key]) {
    return false;
  }
  return regex[key].test(value);
};
