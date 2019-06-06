import * as formUtils from './form';
import accounts from '../../test/constants/accounts';

describe('Form Utils', () => {
  describe('passphraseIsValid', () => {
    it('Should return thruthy if passhrase has no error and not empty', () => {
      expect(formUtils.passphraseIsValid({
        error: false,
        value: accounts.genesis.passphrase,
      })).toBeTruthy();
    });

    it('Should return falsy if passphrase has error or is empty', () => {
      expect(formUtils.passphraseIsValid({
        error: true,
        value: accounts.genesis.passphrase,
      })).toBeFalsy();
      expect(formUtils.passphraseIsValid({
        error: false,
        value: '',
      })).toBeFalsy();
    });
  });
});
