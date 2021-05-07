import { MODULE_ASSETS_NAME_ID_MAP, moduleAssetSchemas } from '@constants';
import { getModuleAssetSenderLabel, retrieveSchemas } from './moduleAssets';
import http from './api/http';

jest.mock('./api/http');

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

  describe('selectSchema', () => {
    beforeEach(() => {
      http.mockClear();
    });

    it('should retrieve and set schema', async () => {
      const schema = { properties: [] };
      const data = [
        { moduleAssetId: '2:0', schema },
        { moduleAssetId: '4:0', schema },
        { moduleAssetId: '5:0', schema },
        { moduleAssetId: '5:1', schema },
        { moduleAssetId: '5:2', schema },
      ];
      http.mockImplementation(() => Promise.resolve({ data }));
      await retrieveSchemas({ serviceUrl: 'http://sample.url' });
      expect(moduleAssetSchemas).toEqual({
        '2:0': schema,
        '4:0': schema,
        '5:0': schema,
        '5:1': schema,
        '5:2': schema,
      });
    });
  });
});
