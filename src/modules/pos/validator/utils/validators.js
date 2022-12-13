/* eslint-disable import/prefer-default-export */
import { regex } from 'src/const/regex';

/**
 * Validates give values with the criteria of
 * 1. generatorKey or
 * 2. blsKey or
 * 3. proofOfPossession
 *
 * @param {any} key - The name of the validator key
 * @param {any} value - A value to be validated
 * @returns {boolean} true if valid.
 */
export const validatorKeyValidator = (key, value) => {
  if (typeof value !== 'string' || !regex[key]) {
    return false;
  }
  return regex[key].test(value);
};
