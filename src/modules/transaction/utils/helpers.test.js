import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
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
      const moduleCommand = MODULE_COMMANDS_NAME_MAP.transfer;
      const recipient = host;
      expect(getTxDirectionConfig(moduleCommand, host, recipient, styles))
        .toEqual({ sign: '', style: styles.receive });
    });
    it('should return correct sign and styles for outgoing transfer', () => {
      const moduleCommand = MODULE_COMMANDS_NAME_MAP.transfer;
      const recipient = wallets.delegate.summary.address;
      expect(getTxDirectionConfig(moduleCommand, host, recipient, styles))
        .toEqual({ sign: '- ', style: '' });
    });
    it('should return correct sign and styles for unlock', () => {
      const moduleCommand = MODULE_COMMANDS_NAME_MAP.unlock;
      const recipient = null;
      expect(getTxDirectionConfig(moduleCommand, host, recipient, styles))
        .toEqual({ sign: '', style: styles.unlock });
    });
    it('should return correct sign and styles for reclaim LSK', () => {
      const moduleCommand = MODULE_COMMANDS_NAME_MAP.reclaim;
      const recipient = null;
      expect(getTxDirectionConfig(moduleCommand, host, recipient, styles))
        .toEqual({ sign: '', style: styles.unlock });
    });
  });
});
