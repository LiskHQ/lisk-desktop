import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';
import {
  getModuleCommandSenderLabel,
  getModuleCommandTitle,
  splitModuleAndCommand,
  joinModuleAndCommand,
} from './moduleCommand';

describe('Utils: moduleCommand', () => {
  describe('getModuleCommandSenderLabel', () => {
    it('should return a dictionary of strings', () => {
      const t = jest.fn((str) => str);
      Object.values(MODULE_COMMANDS_NAME_MAP).forEach((moduleCommand) => {
        const label = getModuleCommandSenderLabel(t)[moduleCommand];

        expect(label).toBeDefined();
        expect(typeof label).toBe('string');
        expect(t).toHaveBeenCalledWith(label);
      });
    });
  });

  describe('getModuleCommandTitle', () => {
    it('should return a dictionary of strings', () => {
      const t = jest.fn((str) => str);
      Object.values(MODULE_COMMANDS_NAME_MAP).forEach((moduleCommand) => {
        const label = getModuleCommandTitle(t)[moduleCommand];

        expect(label).toBeDefined();
        expect(typeof label).toBe('string');
        expect(t).toHaveBeenCalledWith(label);
      });
    });
  });

  describe('splitModuleAndCommand', () => {
    it('should split module and asset ids', () => {
      const moduleCommand = 'pos:stake';
      const [module, command] = splitModuleAndCommand(moduleCommand);

      expect(module).toEqual('pos');
      expect(command).toEqual('stake');
    });
  });

  describe('joinModuleAndCommand', () => {
    it('should join module and asset ids', () => {
      const [module, command] = ['pos', 'stake'];
      const moduleCommand = joinModuleAndCommand({ module, command });
      expect(moduleCommand).toEqual('pos:stake');
    });
  });
});
