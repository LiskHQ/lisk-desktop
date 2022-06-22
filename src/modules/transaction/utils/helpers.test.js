import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
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
      const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.transfer;
      const recipient = host;
      expect(getTxDirectionConfig(moduleAssetId, host, recipient, styles))
        .toEqual({ sign: '', style: styles.receive });
    });
    it('should return correct sign and styles for outgoing transfer', () => {
      const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.transfer;
      const recipient = wallets.delegate.summary.address;
      expect(getTxDirectionConfig(moduleAssetId, host, recipient, styles))
        .toEqual({ sign: '- ', style: '' });
    });
    it('should return correct sign and styles for unlock', () => {
      const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.unlockToken;
      const recipient = null;
      expect(getTxDirectionConfig(moduleAssetId, host, recipient, styles))
        .toEqual({ sign: '', style: styles.unlock });
    });
    it('should return correct sign and styles for reclaim LSK', () => {
      const moduleAssetId = MODULE_ASSETS_NAME_ID_MAP.reclaimLSK;
      const recipient = null;
      expect(getTxDirectionConfig(moduleAssetId, host, recipient, styles))
        .toEqual({ sign: '', style: styles.unlock });
    });
  });
});
