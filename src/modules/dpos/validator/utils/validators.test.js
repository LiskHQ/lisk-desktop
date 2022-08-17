import * as keys from '@tests/constants/keys';
import { delegateKeyValidator } from './validators';

describe('validators', () => {
  it('return false if the value is not passed', () => {
    expect(delegateKeyValidator()).toBe(false);
  });

  it('return false if the key doesn\'t exist', () => {
    expect(delegateKeyValidator('someKey', 'someValue')).toBe(false);
  });

  it('return true if the key exist and the value is valid', () => {
    expect(delegateKeyValidator('blsPublicKey', keys.blsKey)).toBe(true);
    expect(delegateKeyValidator('generatorPublicKey', keys.genKey)).toBe(true);
    expect(delegateKeyValidator('proofOfPossession', keys.pop)).toBe(true);
  });
});
