import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';

const getModuleCommandSenderLabel = (t = (str) => str) => ({
  [MODULE_COMMANDS_NAME_MAP.transfer]: t('Sender'),
  [MODULE_COMMANDS_NAME_MAP.crossChainTransfer]: t('Sender'),
  [MODULE_COMMANDS_NAME_MAP.reclaim]: t('Sender'),
  [MODULE_COMMANDS_NAME_MAP.unlock]: t('Sender'),
  [MODULE_COMMANDS_NAME_MAP.stake]: t('Staker'),
  [MODULE_COMMANDS_NAME_MAP.registerValidator]: t('Account username'),
  [MODULE_COMMANDS_NAME_MAP.registerMultisignature]: t('Registrant'),
  [MODULE_COMMANDS_NAME_MAP.reportValidatorMisbehavior]: t('Reporter'),
  [MODULE_COMMANDS_NAME_MAP.claimRewards]: t('Claim rewards'),
  [MODULE_COMMANDS_NAME_MAP.changeCommission]: t('Edit commission'),
  [MODULE_COMMANDS_NAME_MAP.registerKeys]: t('Register keys'),
  [MODULE_COMMANDS_NAME_MAP.registerSidechain]: t('Register side chain'),
});

const getModuleCommandTitle = (t = (str) => str) => ({
  [MODULE_COMMANDS_NAME_MAP.transfer]: t('Transfer'),
  [MODULE_COMMANDS_NAME_MAP.reclaim]: t('Reclaim'),
  [MODULE_COMMANDS_NAME_MAP.claimRewards]: t('Claim Rewards'),
  [MODULE_COMMANDS_NAME_MAP.unlock]: t('Unlock'),
  [MODULE_COMMANDS_NAME_MAP.stake]: t('Stake'),
  [MODULE_COMMANDS_NAME_MAP.registerValidator]: t('Register validator'),
  [MODULE_COMMANDS_NAME_MAP.registerMultisignature]: t('Register multisignature'),
  [MODULE_COMMANDS_NAME_MAP.reportValidatorMisbehavior]: t('Report validator misbehaviour'),
  [MODULE_COMMANDS_NAME_MAP.crossChainTransfer]: t('Cross chain transfer'),
  [MODULE_COMMANDS_NAME_MAP.claimRewards]: t('Claim rewards'),
  [MODULE_COMMANDS_NAME_MAP.changeCommission]: t('Edit commission'),
  [MODULE_COMMANDS_NAME_MAP.registerSidechain]: t('Register side chain'),
  [MODULE_COMMANDS_NAME_MAP.registerKeys]: t('Register keys'),
});

const splitModuleAndCommand = (moduleCommand) => moduleCommand.split(':');

const joinModuleAndCommand = ({ module, command }) => [module, command].join(':');

export {
  getModuleCommandTitle,
  joinModuleAndCommand,
  splitModuleAndCommand,
  getModuleCommandSenderLabel,
};
