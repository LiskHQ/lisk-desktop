/* eslint-disable max-len */
import { cryptography } from '@liskhq/lisk-client';
import accounts from '@tests/constants/wallets';
import {
  extractPublicKey,
  extractPrivateKey,
  extractAddressFromPublicKey,
  calculateUnlockableAmount,
  getPendingUnlockableUnlocks,
  calculateBalanceLockedInStakes,
  extractAddressFromPassphrase,
  calculateRemainingAndSignedMembers,
} from './account';

const passphrase = accounts.genesis.passphrase;
const { address, privateKey, publicKey } = accounts.genesis.summary;
const customDerivationPath = "m/44'/134'/1'";

jest.spyOn(cryptography.address, 'getLisk32AddressFromPublicKey').mockReturnValue(address);
jest
  .spyOn(cryptography.ed, 'getPrivateKeyFromPhraseAndPath')
  .mockResolvedValue(Buffer.from(privateKey));

describe('Utils: Account', () => {
  describe('extractPublicKey', () => {
    it('should return a hex string from any given string', async () => {
      const key = await extractPublicKey(passphrase);
      await expect(key).toEqual(publicKey);
    });

    it('should call getCustomDerivationKeyPair', async () => {
      await extractPublicKey(passphrase, true, customDerivationPath);
      expect(cryptography.ed.getPrivateKeyFromPhraseAndPath).toHaveBeenCalledWith(
        passphrase,
        customDerivationPath
      );
    });
  });

  describe('extractPrivateKey', () => {
    it('should return a hex string from any given string', async () => {
      const key = await extractPrivateKey(passphrase);
      expect(key).toEqual(privateKey);
    });

    it('should call getCustomDerivationKeyPair', async () => {
      await extractPrivateKey(passphrase, true, customDerivationPath);
      expect(cryptography.ed.getPrivateKeyFromPhraseAndPath).toHaveBeenCalledWith(
        passphrase,
        customDerivationPath
      );
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
        {
          amount: '1000000000',
          unstakeHeight: 4900,
          expectedUnlockableHeight: 5900,
          validatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
          isLocked: false,
        },
        {
          amount: '3000000000',
          unstakeHeight: 100,
          expectedUnlockableHeight: 200,
          validatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
          isLocked: true,
        },
        {
          amount: '1000000000',
          unstakeHeight: 3000,
          expectedUnlockableHeight: 4000,
          validatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13',
          isLocked: true,
        },
      ];
      const validatorAddress = '80L';

      expect(calculateUnlockableAmount(unlocking)).toEqual(4000000000);

      unlocking = [
        {
          amount: '1000000000',
          unstakeHeight: 4900,
          expectedUnlockableHeight: 5900,
          validatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
        },
        {
          amount: '3000000000',
          unstakeHeight: 2500,
          expectedUnlockableHeight: 5500,
          validatorAddress
        },
        {
          amount: '1000000000',
          unstakeHeight: 3000,
          expectedUnlockableHeight: 5500,
          validatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13',
        },
      ];
      expect(calculateUnlockableAmount(unlocking)).toEqual(0);
    });

    describe('calculateBalanceLockedInStakes', () => {
      it('should get correct available balance', () => {
        const stakes = {
          lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11: { confirmed: 5000000000 },
          lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12: { confirmed: 3000000000 },
          lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13: { confirmed: 2000000000 },
        };

        expect(calculateBalanceLockedInStakes(stakes)).toEqual(10000000000);
      });

      it('should return 0 when unlocking is undefined', () => {
        expect(calculateBalanceLockedInStakes({})).toEqual(0);
      });
    });

    describe('getAvailableUnlockingTransactions', () => {
      it('should get correct available balance', () => {
        const unlocking = [
          {
            amount: '1000000000',
            unstakeHeight: 5000,
            expectedUnlockableHeight: 6000,
            validatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
            isLocked: true,
          },
          {
            amount: '3000000000',
            unstakeHeight: 100,
            expectedUnlockableHeight: 2000,
            validatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
            isLocked: false,
          },
          {
            amount: '1000000000',
            unstakeHeight: 3100,
            expectedUnlockableHeight: 41000,
            validatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13',
            isLocked: true,
          },
        ];

        expect(getPendingUnlockableUnlocks(unlocking)).toEqual([
          {
            amount: '3000000000',
            unstakeHeight: 100,
            expectedUnlockableHeight: 2000,
            validatorAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11',
            isLocked: false,
          },
        ]);
      });
    });
  });

  describe('calculateRemainingAndSignedMembers', () => {
    it('should return signed and remaining members', () => {
      const keys = {
        mandatoryKeys: [
          'c5e64031407c3ca8d526bf7404f7c78ab60ea0792e90393a73b3b06a8c8841d4',
          'a1fa251b368939ed2aa8c620e955cb4537c06a351fa50e928ec21e89372e7494',
        ],
        optionalKeys: [
          '35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
          '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
          '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19',
        ],
      };

      const result = calculateRemainingAndSignedMembers(keys, {
        signatures: [],
      });
      expect(result).toMatchSnapshot();
    });

    it('should return signed and remaining members', () => {
      const keys = {
        mandatoryKeys: [
          'c5e64031407c3ca8d526bf7404f7c78ab60ea0792e90393a73b3b06a8c8841d4',
          'a1fa251b368939ed2aa8c620e955cb4537c06a351fa50e928ec21e89372e7494',
        ],
        optionalKeys: [
          '35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
          '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
          '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19',
        ],
      };

      const signatures = ['signature'];
      const result = calculateRemainingAndSignedMembers(keys, { signatures });
      expect(result).toMatchSnapshot();
    });

    it('should return signed and remaining members', () => {
      const keys = {
        mandatoryKeys: [
          'c5e64031407c3ca8d526bf7404f7c78ab60ea0792e90393a73b3b06a8c8841d4',
          'a1fa251b368939ed2aa8c620e955cb4537c06a351fa50e928ec21e89372e7494',
        ],
        optionalKeys: [
          '35c6b25520fc868b56c83fed6e1c89bb350fb7994a5da0bcea7a4f621f948c7f',
          '0fe9a3f1a21b5530f27f87a414b549e79a940bf24fdf2b2f05e7f22aeeecc86a',
          '86499879448d1b0215d59cbf078836e3d7d9d2782d56a2274a568761bff36f19',
        ],
      };

      const signatures = ['sender_signature', 'signature', '', 'does not matter'];
      const result = calculateRemainingAndSignedMembers(keys, { params: { signatures } }, true);
      expect(result).toMatchSnapshot();
    });
  });
});
