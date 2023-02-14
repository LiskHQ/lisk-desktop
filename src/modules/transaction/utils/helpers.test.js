import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import wallets from '@tests/constants/wallets';
import mockSavedAccounts from '@tests/fixtures/accounts';
import getTxDirectionConfig, { filterIncomingTransactions, dateRangeCompare } from './helpers';

describe('helpers', () => {
  describe('getTxDirectionConfig', () => {
    const styles = {
      unlock: 'unlock',
      receive: 'receive',
    };
    const host = wallets.genesis.summary.address;
    it('should return correct sign and styles for incoming transfer', () => {
      const moduleCommand = MODULE_COMMANDS_NAME_MAP.transfer;
      const recipient = host;
      expect(getTxDirectionConfig(moduleCommand, host, recipient, styles)).toEqual({
        sign: '',
        style: styles.receive,
      });
    });
    it('should return correct sign and styles for outgoing transfer', () => {
      const moduleCommand = MODULE_COMMANDS_NAME_MAP.transfer;
      const recipient = wallets.validator.summary.address;
      expect(getTxDirectionConfig(moduleCommand, host, recipient, styles)).toEqual({
        sign: '- ',
        style: '',
      });
    });
    it('should return correct sign and styles for unlock', () => {
      const moduleCommand = MODULE_COMMANDS_NAME_MAP.unlock;
      const recipient = null;
      expect(getTxDirectionConfig(moduleCommand, host, recipient, styles)).toEqual({
        sign: '',
        style: styles.unlock,
      });
    });
    it('should return correct sign and styles for reclaim LSK', () => {
      const moduleCommand = MODULE_COMMANDS_NAME_MAP.reclaim;
      const recipient = null;
      expect(getTxDirectionConfig(moduleCommand, host, recipient, styles)).toEqual({
        sign: '',
        style: styles.unlock,
      });
    });
  });

  describe('filterIncomingTransactions', () => {
    it('should return transactions for passed in account', () => {
      const txns = [
        {
          id: `ec2b25bafc284b064323ab12f391684eba8a89b4d8591f424e04bc5bb24e6233`,
          type: 0,
          moduleCommand: 'token:transfer',
          fee: '10000000',
          isPending: false,
          sender: { address: 'lskdwsyfmcko6mcd357446yatromr9vzgu7eb8y11' },
          params: {
            amount: '200',
            recipientAddress: 'lsk8nxtxs9ekqc3c2jjtcsusmfj2498qyjbk35teh',
            data: 'test',
          },
          block: {
            timestamp: 106359314,
            height: 9381199,
          },
        },
        {
          id: `af2b25bafc284b068264ab12f132897eba8a89b4d8591f424e04bc5bb24e1980`,
          type: 0,
          moduleCommand: 'token:transfer',
          fee: '10000000',
          isPending: false,
          sender: { address: 'lskqw2b528hc6ud7y56toq3kmaq6kj2fpvf9amvtx' },
          params: {
            amount: '200',
            recipientAddress: 'lsk3ay4z7wqjczbo5ogcqxgxx23xyacxmycwxfh4d',
            data: '',
          },
          block: {
            timestamp: 106350086,
            height: 9381127,
          },
        },
      ];
      const currAcct = mockSavedAccounts[0];
      expect(filterIncomingTransactions(txns, currAcct)).toEqual([txns[1]]);
    });
  });

  describe('dateRangeCompare', () => {
    const txDate = 1671187868;
    // '1671181368:1671188268'
    it('returns true if given date falls within from and to dates', () => {
      const filterDateRange = '1671181368:1671188268';
      expect(dateRangeCompare(filterDateRange, txDate)).toBe(true);
    });
    it('returns false if given date falls within from and to dates', () => {
      const filterDateRange = '1671181368:1671187268';
      expect(dateRangeCompare(filterDateRange, txDate)).toBe(false);
    });
    it('returns true if only from date is supplied and given date falls within from date', () => {
      const filterDateRange = '1671181368:';
      expect(dateRangeCompare(filterDateRange, txDate)).toBe(true);
    });
    it('returns false if only from date is supplied and given date falls below from date', () => {
      const filterDateRange = '1671189532:';
      expect(dateRangeCompare(filterDateRange, txDate)).toBe(false);
    });
    it('returns true if only to date is supplied and given date falls within to date', () => {
      const filterDateRange = ':1671188315';
      expect(dateRangeCompare(filterDateRange, txDate)).toBe(true);
    });
    it('returns false if only to date is supplied and given date falls above to date', () => {
      const filterDateRange = ':1671186952';
      expect(dateRangeCompare(filterDateRange, txDate)).toBe(false);
    });
    it('returns true if only to date and from date are not supplied', () => {
      const filterDateRange = undefined;
      expect(dateRangeCompare(filterDateRange, txDate)).toBe(true);
    });
  });
});
