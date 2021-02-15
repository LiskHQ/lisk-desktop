import { expect } from 'chai';
import {
  extractPublicKey, extractAddress, getActiveTokenAccount, isAccountInitialized,
} from './account';

describe('Utils: Account', () => {
  describe('extractPublicKey', () => {
    it('should return a Hex string from any given string', () => {
      const passphrase = 'field organ country moon fancy glare pencil combine derive fringe security pave';
      const publicKey = 'a89751689c446067cc2107ec2690f612eb47b5939d5570d0d54b81eafaf328de';
      expect(extractPublicKey(passphrase)).to.be.equal(publicKey);
    });
  });

  describe('extractAddress', () => {
    it('should return the account address from given passphrase', () => {
      const passphrase = 'field organ country moon fancy glare pencil combine derive fringe security pave';
      const derivedAddress = '440670704090200331L';
      expect(extractAddress(passphrase)).to.be.equal(derivedAddress);
    });

    it('should return the account address from given public key', () => {
      const publicKey = 'a89751689c446067cc2107ec2690f612eb47b5939d5570d0d54b81eafaf328de';
      const derivedAddress = '440670704090200331L';
      expect(extractAddress(publicKey)).to.be.equal(derivedAddress);
    });

    it('should return false if no param passed to it', () => {
      expect(extractAddress()).to.be.equal(false);
    });
  });

  describe('getActiveTokenAccount', () => {
    it('should get account with active token info on the top level', () => {
      const activeToken = 'BTC';
      const account = {
        info: {
          BTC: {
            address: 'btc address dummy',
          },
        },
      };
      const state = {
        account,
        settings: {
          token: {
            active: activeToken,
          },
        },
      };
      expect(getActiveTokenAccount(state)).to.be.deep.equal({
        ...account,
        ...account.info[activeToken],
      });
    });
  });

  describe('isAccountInitialzed', () => {
    it('should return true if initialized', () => {
      const result = isAccountInitialized({ info: { LSK: { serverPublicKey: 'some key' } } });
      // eslint-disable-next-line no-unused-expressions
      expect(result).to.be.true;
    });

    it('should return false if not initialized', () => {
      const result = isAccountInitialized({ info: { LSK: { serverPublicKey: '' } } });
      // eslint-disable-next-line no-unused-expressions
      expect(result).to.be.false;
    });
  });
});
