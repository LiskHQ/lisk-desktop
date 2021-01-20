import {
  extractPublicKey,
  extractAddress,
  getActiveTokenAccount,
  calculateUnlockableBalance,
  getAvailableUnlockingTransactions,
  calculateLockedBalance,
} from './account';

describe('Utils: Account', () => {
  describe('extractPublicKey', () => {
    it('should return a Hex string from any given string', () => {
      const passphrase = 'field organ country moon fancy glare pencil combine derive fringe security pave';
      const publicKey = 'a89751689c446067cc2107ec2690f612eb47b5939d5570d0d54b81eafaf328de';
      expect(extractPublicKey(passphrase)).toEqual(publicKey);
    });
  });

  describe('extractAddress', () => {
    it('should return the account address from given passphrase', () => {
      const passphrase = 'field organ country moon fancy glare pencil combine derive fringe security pave';
      const derivedAddress = '440670704090200331L';
      expect(extractAddress(passphrase)).toEqual(derivedAddress);
    });

    it('should return the account address from given public key', () => {
      const publicKey = 'a89751689c446067cc2107ec2690f612eb47b5939d5570d0d54b81eafaf328de';
      const derivedAddress = '440670704090200331L';
      expect(extractAddress(publicKey)).toEqual(derivedAddress);
    });

    it('should return false if no param passed to it', () => {
      expect(extractAddress()).toEqual(false);
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
      expect(getActiveTokenAccount(state)).toStrictEqual({
        ...account,
        ...account.info[activeToken],
      });
    });
  });

  describe('calculateAvailableBalance', () => {
    it('should get correct available balance', () => {
      let unlocking = [
        { amount: '1000000000', unvoteHeight: 4900, delegateAddress: '1L' },
        { amount: '3000000000', unvoteHeight: 100, delegateAddress: '1L' },
        { amount: '1000000000', unvoteHeight: 3000, delegateAddress: '3L' },
      ];
      const address = '80L';
      const currentBlock = { height: 5000 };

      expect(
        calculateUnlockableBalance({ unlocking, address }, currentBlock),
      ).toEqual(3000000000);

      unlocking = [
        { amount: '1000000000', unvoteHeight: 4900, delegateAddress: '1L' },
        { amount: '3000000000', unvoteHeight: 2500, delegateAddress: address },
        { amount: '1000000000', unvoteHeight: 3000, delegateAddress: '3L' },
      ];
      expect(
        calculateUnlockableBalance({ unlocking, address }, currentBlock),
      ).toEqual(0);
    });

    it('should return 0 when unlocking is undefined', () => {
      const address = '80L';
      const currentBlock = { height: 5000 };

      expect(
        calculateUnlockableBalance({ address }, currentBlock),
      ).toEqual(0);
    });

    describe('calculateLockedBalance', () => {
      it('should get correct available balance', () => {
        const votes = [
          { amount: '5000000000', delegateAddress: '1L' },
          { amount: '3000000000', delegateAddress: '3L' },
          { amount: '2000000000', delegateAddress: '1L' },
        ];

        expect(calculateLockedBalance({ votes })).toEqual(10000000000);
      });

      it('should return 0 when unlocking is undefined', () => {
        expect(calculateLockedBalance({ })).toEqual(0);
      });
    });

    describe('getAvailableUnlockingTransactions', () => {
      it('should get correct available balance', () => {
        const unlocking = [
          { amount: '1000000000', unvoteHeight: 5000, delegateAddress: '1L' },
          { amount: '3000000000', unvoteHeight: 100, delegateAddress: '1L' },
          { amount: '1000000000', unvoteHeight: 3100, delegateAddress: '3L' },
        ];
        const address = '80L';
        const currentBlock = { height: 5000 };

        expect(
          getAvailableUnlockingTransactions({ unlocking, address }, currentBlock),
        ).toEqual([{ amount: '3000000000', unvoteHeight: 100, delegateAddress: '1L' }]);
      });

      it('should return 0 when unlocking is undefined', () => {
        const address = '80L';
        const currentBlock = { height: 5000 };
        expect(getAvailableUnlockingTransactions({ address }, currentBlock)).toEqual([]);
      });
    });
  });
});
