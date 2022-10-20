import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';

const getModuleCommandSenderLabel = (t = str => str) => ({
  [MODULE_COMMANDS_NAME_MAP.transfer]: t('Sender'),
  [MODULE_COMMANDS_NAME_MAP.reclaim]: t('Sender'),
  [MODULE_COMMANDS_NAME_MAP.unlock]: t('Sender'),
  [MODULE_COMMANDS_NAME_MAP.voteDelegate]: t('Voter'),
  [MODULE_COMMANDS_NAME_MAP.registerDelegate]: t('Account username'),
  [MODULE_COMMANDS_NAME_MAP.registerMultisignature]: t('Registrant'),
  [MODULE_COMMANDS_NAME_MAP.reportDelegateMisbehavior]: t('Reporter'),
});

const getModuleCommandTitle = (t = str => str) => ({
  [MODULE_COMMANDS_NAME_MAP.transfer]: t('Send'),
  [MODULE_COMMANDS_NAME_MAP.reclaim]: t('Reclaim'),
  [MODULE_COMMANDS_NAME_MAP.unlock]: t('Unlock'),
  [MODULE_COMMANDS_NAME_MAP.voteDelegate]: t('Vote'),
  [MODULE_COMMANDS_NAME_MAP.registerDelegate]: t('Register delegate'),
  [MODULE_COMMANDS_NAME_MAP.registerMultisignature]: t('Register multisignature'),
  [MODULE_COMMANDS_NAME_MAP.reportDelegateMisbehavior]: t('Report delegate misbehaviour'),
});

const splitModuleAndCommand = (moduleCommand) => moduleCommand.split(':');

const joinModuleAndCommand = ({ module, command }) => [module, command].join(':');

export {
  getModuleCommandTitle,
  joinModuleAndCommand,
  splitModuleAndCommand,
  getModuleCommandSenderLabel,
};
