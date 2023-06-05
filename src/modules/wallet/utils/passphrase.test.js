import { expect } from 'chai';
import accounts from '@tests/constants/wallets';
import { generatePassphraseFromSeed, isValidPassphrase } from './passphrase';

if (global._bitcore) delete global._bitcore;
const mnemonic = require('bitcore-mnemonic');

describe('Passphrase', () => {
  describe('generatePassphraseFromSeed', () => {
    const seed = [
      'e6',
      '3c',
      'd1',
      '36',
      'e9',
      '70',
      '5f',
      'c0',
      '4d',
      '31',
      'ef',
      'b8',
      'd6',
      '53',
      '48',
      '11',
    ];

    it('generates a valid random passphrase from a given seed', () => {
      const passphrase = generatePassphraseFromSeed({ seed });
      expect(mnemonic.isValid(passphrase)).to.be.equal(true);
    });
  });

  describe('isValidPassphrase', () => {
    it('should return true for valid passphrase', () => {
      const { passphrase } = accounts.genesis;
      expect(isValidPassphrase(passphrase)).to.be.equal(true);
    });

    it('should validate an invalid passphrase', () => {
      const passphrase = 'stock borrow episode laundry kitten salute link globe zero feed marble';
      expect(isValidPassphrase(passphrase)).to.be.equal(false);
    });
  });
});
