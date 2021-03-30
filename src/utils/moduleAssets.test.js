import { MODULE_ASSETS_NAME_ID_MAP, moduleAssetSchema } from '@constants';
import { getModuleAssetSenderLabels, retrieveSchemas } from './moduleAssets';
import http from './api/http';
import flushPromises from '../../test/unit-test-utils/flushPromises';

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

    it('should rretrueve and set schema', async () => {
      const expectedSchema = { id: 'id' };
      http.mockImplementation(() => Promise.resolve({ data: [{ schema: expectedSchema }] }));
      retrieveSchemas();
      await flushPromises();
      expect(moduleAssetSchema).toEqual({
        '2:0': expectedSchema,
        '4:0': expectedSchema,
        '5:0': expectedSchema,
        '5:1': expectedSchema,
        '5:2': expectedSchema,
      });
    });
  });
});
