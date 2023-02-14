import * as keys from '@tests/constants/keys';
import { validatorKeyValidator } from './validators';

describe('validators', () => {
  it('return false if the value is not passed', () => {
    expect(validatorKeyValidator()).toBe(false);
  });

  it("return false if the key doesn't exist", () => {
    expect(validatorKeyValidator('someKey', 'someValue')).toBe(false);
  });

  it('return true if the key exist and the value is valid', () => {
    expect(validatorKeyValidator('blsKey', keys.blsKey)).toBe(true);
    expect(validatorKeyValidator('generatorKey', keys.genKey)).toBe(true);
    expect(validatorKeyValidator('proofOfPossession', keys.pop)).toBe(true);
  });
});
