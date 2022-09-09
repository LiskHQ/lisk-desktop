import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import wallets from '@tests/constants/wallets';
import getTxDirectionConfig from './helpers';

describe('helpers', () => {
  describe('getTxDirectionConfig', () => {
    const styles = {
      unlock: 'unlock',
      receive: 'receive',
    };
    const host = wallets.genesis.summary.address;
    it('should return correct sign and styles for incoming transfer', () => {
      const moduleCommandID = MODULE_COMMANDS_NAME_ID_MAP.transfer;
      const recipient = host;
      expect(getTxDirectionConfig(moduleCommandID, host, recipient, styles)).toEqual({
        sign: '',
        style: styles.receive,
      });
    });
    it('should return correct sign and styles for outgoing transfer', () => {
      const moduleCommandID = MODULE_COMMANDS_NAME_ID_MAP.transfer;
      const recipient = wallets.delegate.summary.address;
      expect(getTxDirectionConfig(moduleCommandID, host, recipient, styles)).toEqual({
        sign: '- ',
        style: '',
      });
    });
    it('should return correct sign and styles for unlock', () => {
      const moduleCommandID = MODULE_COMMANDS_NAME_ID_MAP.unlockToken;
      const recipient = null;
      expect(getTxDirectionConfig(moduleCommandID, host, recipient, styles)).toEqual({
        sign: '',
        style: styles.unlock,
      });
    });
    it('should return correct sign and styles for reclaim LSK', () => {
      const moduleCommandID = MODULE_COMMANDS_NAME_ID_MAP.reclaimLSK;
      const recipient = null;
      expect(getTxDirectionConfig(moduleCommandID, host, recipient, styles)).toEqual({
        sign: '',
        style: styles.unlock,
      });
    });
  });
});
