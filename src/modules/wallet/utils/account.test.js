import { getCustomDerivationKeyPair } from 'src/utils/explicitBipKeyDerivation';
import accounts from '@tests/constants/wallets';
import {
  extractPublicKey,
  extractPrivateKey,
  extractAddressFromPublicKey,
  calculateUnlockableBalance,
  getUnlockableUnlockObjects,
  calculateBalanceLockedInVotes,
  extractAddressFromPassphrase,
  calculateRemainingAndSignedMembers,
} from './account';

const passphrase = accounts.genesis.passphrase;
const {
  address,
  privateKey,
  publicKey,
} = accounts.genesis.summary;

jest.mock('src/utils/explicitBipKeyDerivation', () => ({
  getCustomDerivationKeyPair: jest.fn(),
}));

describe.skip('Utils: Account', () => {
  describe('extractPublicKey', () => {
    it('should return a hex string from any given string', () => {
      expect(extractPublicKey(passphrase)).toEqual(publicKey);
    });

    it('should call getCustomDerivationKeyPair', () => {
      extractPublicKey(passphrase, true, '1/2');
      expect(getCustomDerivationKeyPair).toHaveBeenCalledWith(passphrase, '1/2');
    });
  });

  describe('extractPrivateKey', () => {
    it('should return a hex string from any given string', () => {
      expect(extractPrivateKey(passphrase)).toEqual(privateKey);
    });

    it('should call getCustomDerivationKeyPair', () => {
      extractPrivateKey(passphrase, true, '1/2');
      expect(getCustomDerivationKeyPair).toHaveBeenCalledWith(passphrase, '1/2');
    });
  });

  describe('extractAddressFromPublicKey', () => {
    it('should return the address corresponding to a (hex) public key', () => {
      expect(extractAddressFromPublicKey(publicKey)).toEqual(address);
    });

    it('should return the address corresponding to a (binary) public key', () => {
      const binaryPublicKey = Buffer.from(publicKey, 'hex');
      expect(extractAddressFromPublicKey(binaryPublicKey)).toEqual(address);
    });
  });

  describe('extractAddressFromPassphrase', () => {
    it('should return the address corresponding to a passphrase', () => {
      expect(extractAddressFromPassphrase(passphrase)).toEqual(address);
    });
  });

  describe('unlocking util functions', () => {
    it('should get correct available balance', () => {
      let unlocking = [
        { amount: '1000000000', height: { start: 4900, end: 5900 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
        { amount: '3000000000', height: { start: 100, end: 200 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
        { amount: '1000000000', height: { start: 3000, end: 4000 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13' },
      ];
      const delegateAddress = '80L';
      const currentBlockHeight = 5000;

      expect(
        calculateUnlockableBalance(unlocking, currentBlockHeight),
      ).toEqual(4000000000);

      unlocking = [
        { amount: '1000000000', height: { start: 4900, end: 5900 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
        { amount: '3000000000', height: { start: 2500, end: 5500 }, delegateAddress },
        { amount: '1000000000', height: { start: 3000, end: 5500 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13' },
      ];
      expect(
        calculateUnlockableBalance(unlocking, currentBlockHeight),
      ).toEqual(0);
    });

    it('should return 0 when unlocking is undefined', () => {
      const currentBlockHeight = 5000;
      expect(
        calculateUnlockableBalance(undefined, currentBlockHeight),
      ).toEqual(0);
    });

    describe('calculateBalanceLockedInVotes', () => {
      it('should get correct available balance', () => {
        const votes = {
          lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11: { confirmed: 5000000000 },
          lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12: { confirmed: 3000000000 },
          lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13: { confirmed: 2000000000 },
        };

        expect(calculateBalanceLockedInVotes(votes)).toEqual(10000000000);
      });

      it('should return 0 when unlocking is undefined', () => {
        expect(calculateBalanceLockedInVotes({})).toEqual(0);
      });
    });

    describe('getAvailableUnlockingTransactions', () => {
      it('should get correct available balance', () => {
        const unlocking = [
          { amount: '1000000000', height: { start: 5000, end: 6000 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
          { amount: '3000000000', height: { start: 100, end: 2000 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
          { amount: '1000000000', height: { start: 3100, end: 41000 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13' },
        ];
        const currentBlockHeight = 5000;

        expect(
          getUnlockableUnlockObjects(unlocking, currentBlockHeight),
        ).toEqual([{ amount: '3000000000', unvoteHeight: 100, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' }]);
      });

      it('should return 0 when unlocking is undefined', () => {
        const currentBlockHeight = 5000;
        expect(getUnlockableUnlockObjects(undefined, currentBlockHeight)).toEqual([]);
      });
    });
  });

  describe('calculateRemainingAndSignedMembers', () => {
    it('should return signed and remaining members', () => {
      const keys = {
        mandatoryKeys: ['c5e64031407c3ca8d526bf7404f7c78ab60ea0792e90393a73b3b06a8c8841d4',
          'a1fa251b368939ed2aa8c620e955cb4537c06a351fa50e928ec21e89372e7494'],
        optionalKeys: ['35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
          '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
          '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19'],
      };

      const signatures = [];
      const result = calculateRemainingAndSignedMembers(keys, signatures);
      expect(result).toMatchSnapshot();
    });

    it('should return signed and remaining members', () => {
      const keys = {
        mandatoryKeys: ['c5e64031407c3ca8d526bf7404f7c78ab60ea0792e90393a73b3b06a8c8841d4',
          'a1fa251b368939ed2aa8c620e955cb4537c06a351fa50e928ec21e89372e7494'],
        optionalKeys: ['35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
          '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
          '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19'],
      };

      const signatures = ['haha'];
      const result = calculateRemainingAndSignedMembers(keys, signatures);
      expect(result).toMatchSnapshot();
    });

    it('should return signed and remaining members', () => {
      const keys = {
        mandatoryKeys: ['c5e64031407c3ca8d526bf7404f7c78ab60ea0792e90393a73b3b06a8c8841d4',
          'a1fa251b368939ed2aa8c620e955cb4537c06a351fa50e928ec21e89372e7494'],
        optionalKeys: ['35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
          '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
          '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19'],
      };

      const signatures = [
        'sender_signature',
        'haha',
        '',
        'does not matter',
      ];
      const result = calculateRemainingAndSignedMembers(keys, signatures, true);
      expect(result).toMatchSnapshot();
    });
  });
});
