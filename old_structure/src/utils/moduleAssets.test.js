import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import {
  getModuleAssetSenderLabel,
  getModuleAssetTitle,
  splitModuleAndAssetIds,
  joinModuleAndAssetIds,
} from './moduleAssets';

describe('Utils: moduleAssets', () => {
  describe('getModuleAssetSenderLabel', () => {
    it('should return a dictionary of strings', () => {
      const t = jest.fn(str => str);
      const dict = getModuleAssetSenderLabel(t);
      const label = dict[MODULE_ASSETS_NAME_ID_MAP.transfer];

      expect(label).toBeDefined();
      expect(typeof label).toBe('string');
      expect(t).toHaveBeenCalled();
    });
  });

  describe('getModuleAssetTitle', () => {
    it('should return a dictionary of strings', () => {
      const t = jest.fn(str => str);
      const dict = getModuleAssetTitle(t);
      const label = dict[MODULE_ASSETS_NAME_ID_MAP.transfer];

      expect(label).toBeDefined();
      expect(typeof label).toBe('string');
      expect(t).toHaveBeenCalled();
    });
  });

  describe('splitModuleAndAssetIds', () => {
    it('should split module and asset ids', () => {
      const moduleAssetId = '5:1';
      const [moduleID, assetID] = splitModuleAndAssetIds(moduleAssetId);

      expect(moduleID).toEqual(5);
      expect(assetID).toEqual(1);
    });
  });

  describe('joinModuleAndAssetIds', () => {
    it('should join module and asset ids', () => {
      const [moduleID, assetID] = [5, 1];
      const moduleAssetId = joinModuleAndAssetIds({ moduleID, assetID });
      expect(moduleAssetId).toEqual('5:1');
    });
  });
});
