import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import {
  getModuleCommandSenderLabel,
  getModuleCommandTitle,
  splitModuleAndCommand,
  joinModuleAndCommand,
} from './moduleCommand';

describe('Utils: moduleAssets', () => {
  describe('getModuleCommandSenderLabel', () => {
    it('should return a dictionary of strings', () => {
      const t = jest.fn(str => str);
      const dict = getModuleCommandSenderLabel(t);
      const label = dict[MODULE_COMMANDS_NAME_MAP.transfer];

      expect(label).toBeDefined();
      expect(typeof label).toBe('string');
      expect(t).toHaveBeenCalled();
    });
  });

  describe('getModuleCommandTitle', () => {
    it('should return a dictionary of strings', () => {
      const t = jest.fn(str => str);
      const dict = getModuleCommandTitle(t);
      const label = dict[MODULE_COMMANDS_NAME_MAP.transfer];

      expect(label).toBeDefined();
      expect(typeof label).toBe('string');
      expect(t).toHaveBeenCalled();
    });
  });

  describe('splitModuleAndCommand', () => {
    it('should split module and asset ids', () => {
      const moduleCommand = 'dpos:voteDelegate';
      const [module, command] = splitModuleAndCommand(moduleCommand);

      expect(module).toEqual('dpos');
      expect(command).toEqual('voteDelegate');
    });
  });

  describe('joinModuleAndCommand', () => {
    it('should join module and asset ids', () => {
      const [module, command] = ['dpos', 'voteDelegate'];
      const moduleCommand = joinModuleAndCommand({ module, command });
      expect(moduleCommand).toEqual('dpos:voteDelegate');
    });
  });
});
