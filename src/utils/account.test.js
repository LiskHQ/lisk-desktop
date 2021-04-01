import {
  extractPublicKey,
  extractAddress,
  getActiveTokenAccount,
  calculateUnlockableBalance,
  getUnlockableUnlockingObjects,
  calculateBalanceLockedInVotes,
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

  describe('unlocking util functions', () => {
    it('should get correct available balance', () => {
      let unlocking = [
        { amount: '1000000000', height: { start: 4900, end: 5900 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
        { amount: '3000000000', height: { start: 100, end: 200 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
        { amount: '1000000000', height: { start: 3000, end: 4000 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13' },
      ];
      const address = '80L';
      const currentBlockHeight = 5000;

      expect(
        calculateUnlockableBalance(unlocking, currentBlockHeight),
      ).toEqual(4000000000);

      unlocking = [
        { amount: '1000000000', height: { start: 4900, end: 5900 }, delegateAddress: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
        { amount: '3000000000', height: { start: 2500, end: 5500 }, delegateAddress: address },
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
          'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11': { confirmed: 5000000000 },
          'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y12': { confirmed: 3000000000 },
          'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y13': { confirmed: 2000000000 },
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
});
