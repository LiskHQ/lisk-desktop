import { MODULE_ASSETS_NAME_ID_MAP } from '@constants';
import { getModuleAssetSenderLabels, selectSchema } from './moduleAssets';
import http from './api/http';

jest.mock('./api/http');

describe('Utils: moduleAssets', () => {
  describe('getModuleAssetSenderLabels', () => {
    it('should return a dictionary of strings', () => {
      const t = jest.fn(str => str);
      const dict = getModuleAssetSenderLabels(t);
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

    it('', async () => {
      const expectedSchema = { id: 'id' };
      http.mockImplementation(() => Promise.resolve({ data: [{ schema: expectedSchema }] }));
      const schema = await selectSchema('2:0');
      expect(schema).toEqual(expectedSchema);
      await selectSchema('2:0');
      expect(http).toHaveBeenCalledTimes(1);
    });
  });
});
