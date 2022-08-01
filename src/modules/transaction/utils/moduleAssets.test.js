import { cryptography } from '@liskhq/lisk-client';
import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import {
  getModuleCommandSenderLabel,
  getModuleCommandTitle,
  splitModuleAndCommandIds,
  joinModuleAndCommandIds,
} from './moduleAssets';

describe('Utils: moduleAssets', () => {
  describe('getModuleCommandSenderLabel', () => {
    it('should return a dictionary of strings', () => {
      const t = jest.fn(str => str);
      const dict = getModuleCommandSenderLabel(t);
      const label = dict[MODULE_COMMANDS_NAME_ID_MAP.transfer];

      expect(label).toBeDefined();
      expect(typeof label).toBe('string');
      expect(t).toHaveBeenCalled();
    });
  });

  describe('getModuleCommandTitle', () => {
    it('should return a dictionary of strings', () => {
      const t = jest.fn(str => str);
      const dict = getModuleCommandTitle(t);
      const label = dict[MODULE_COMMANDS_NAME_ID_MAP.transfer];

      expect(label).toBeDefined();
      expect(typeof label).toBe('string');
      expect(t).toHaveBeenCalled();
    });
  });

  describe('splitModuleAndCommandIds', () => {
    it('should split module and asset ids', () => {
      const moduleCommandID = '5:1';
      const [moduleID, commandID] = splitModuleAndCommandIds(moduleCommandID);

      expect(moduleID).toEqual(cryptography.utils.intToBuffer(5, 4));
      expect(commandID).toEqual(cryptography.utils.intToBuffer(1, 4));
    });
  });

  describe('joinModuleAndCommandIds', () => {
    it('should join module and asset ids', () => {
      const [moduleID, commandID] = [5, 1];
      const moduleCommandID = joinModuleAndCommandIds({ moduleID, commandID });
      expect(moduleCommandID).toEqual('5:1');
    });
  });
});
