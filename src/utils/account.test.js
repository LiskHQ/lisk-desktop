import accounts from '../../test/constants/accounts';
import {
  extractPublicKey,
  extractAddressFromPublicKey,
  getActiveTokenAccount,
  calculateUnlockableBalance,
  getUnlockableUnlockingObjects,
  calculateBalanceLockedInVotes,
  extractAddressFromPassphrase,
  isAccountInitialized,
  hasEnoughBalanceForInitialization,
} from './account';

const passphrase = accounts.genesis.passphrase;
const publicKey = accounts.genesis.summary.serverPublicKey;
const address = accounts.genesis.summary.address;

describe('Utils: Account', () => {
  describe('extractPublicKey', () => {
    it('should return a hex string from any given string', () => {
      expect(extractPublicKey(passphrase)).toEqual(publicKey);
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
          getUnlockableUnlockingObjects(unlocking, currentBlockHeight),
        ).toEqual([{ amount: '3000000000', unvoteHeight: 100, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' }]);
      });

      it('should return 0 when unlocking is undefined', () => {
        const currentBlockHeight = 5000;
        expect(getUnlockableUnlockingObjects(undefined, currentBlockHeight)).toEqual([]);
      });
    });
  });

  describe('isAccountInitialzed', () => {
    it('should return true if initialized', () => {
      const result = isAccountInitialized({ info: { LSK: { serverPublicKey: 'some key' } } });
      expect(result).toBe(true);
    });

    it('should return false if not initialized', () => {
      const result = isAccountInitialized({ info: { LSK: { serverPublicKey: '' } } });
      expect(result).toBe(false);
    });
  });

  describe('hasEnoughBalanceForInitialization', () => {
    it('should return true if balance is enough', () => {
      const result = hasEnoughBalanceForInitialization('200000000');
      expect(result).toBe(true);
    });

    it('should return false if balance is not enough', () => {
      const result = hasEnoughBalanceForInitialization('0');
      expect(result).toBe(false);
    });
  });
});
