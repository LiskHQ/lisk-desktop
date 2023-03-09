import { MODULE_COMMANDS_NAME_MAP } from 'src/modules/transaction/configuration/moduleCommand';

const getModuleCommandSenderLabel = (t = str => str) => ({
  [MODULE_COMMANDS_NAME_MAP.registerMultisignature]: t('Registrant'),
  [MODULE_COMMANDS_NAME_MAP.submitMainchainCrossChainUpdate]: t('Certificate'),
  [MODULE_COMMANDS_NAME_MAP.initializeMessageRecovery]: t('Message'),
  [MODULE_COMMANDS_NAME_MAP.recoverMessage]: t('Message'),
  [MODULE_COMMANDS_NAME_MAP.registerSidechain]: t('Application'),
  [MODULE_COMMANDS_NAME_MAP.recoverState]: t('Message'),
  [MODULE_COMMANDS_NAME_MAP.terminateSidechainForLiveness]: t('Application'),
  [MODULE_COMMANDS_NAME_MAP.reclaimLSK]: t('Sender'),
  [MODULE_COMMANDS_NAME_MAP.registerKeys]: t('Validator'),
  [MODULE_COMMANDS_NAME_MAP.registerValidator]: t('Validator'),
  [MODULE_COMMANDS_NAME_MAP.reportMisbehavior]: t('Sender'),
  [MODULE_COMMANDS_NAME_MAP.unlock]: t('Sender'),
  [MODULE_COMMANDS_NAME_MAP.updateGeneratorKey]: t('Validator'),
  [MODULE_COMMANDS_NAME_MAP.stake]: t('Staker'),
  [MODULE_COMMANDS_NAME_MAP.changeCommission]: t('Validator'),
  [MODULE_COMMANDS_NAME_MAP.claimRewards]: t('Sender'),
  [MODULE_COMMANDS_NAME_MAP.transfer]: t('Sender'),
  [MODULE_COMMANDS_NAME_MAP.transferCrossChain]: t('Sender'),
});

const getModuleCommandTitle = (t = str => str) => ({
  [MODULE_COMMANDS_NAME_MAP.registerMultisignature]: t('Register multisignature'),
  [MODULE_COMMANDS_NAME_MAP.submitMainchainCrossChainUpdate]: t('Cross chain update'),
  [MODULE_COMMANDS_NAME_MAP.initializeMessageRecovery]: t('Message recovery'),
  [MODULE_COMMANDS_NAME_MAP.recoverMessage]: t('Recover message'),
  [MODULE_COMMANDS_NAME_MAP.registerSidechain]: t('Register sidechain'),
  [MODULE_COMMANDS_NAME_MAP.recoverState]: t('Recover state'),
  [MODULE_COMMANDS_NAME_MAP.terminateSidechainForLiveness]: t('Terminate sidechain'),
  [MODULE_COMMANDS_NAME_MAP.reclaimLSK]: t('Reclaim'),
  [MODULE_COMMANDS_NAME_MAP.registerKeys]: t('Register keys'),
  [MODULE_COMMANDS_NAME_MAP.registerValidator]: t('Register validator'),
  [MODULE_COMMANDS_NAME_MAP.reportMisbehavior]: t('Report validator misbehaviour'),
  [MODULE_COMMANDS_NAME_MAP.unlock]: t('Unlock'),
  [MODULE_COMMANDS_NAME_MAP.updateGeneratorKey]: t('Update generator key'),
  [MODULE_COMMANDS_NAME_MAP.stake]: t('Stake'),
  [MODULE_COMMANDS_NAME_MAP.changeCommission]: t('Edit commission'),
  [MODULE_COMMANDS_NAME_MAP.claimRewards]: t('Claim rewards'),
  [MODULE_COMMANDS_NAME_MAP.transfer]: t('Transfer'),
  [MODULE_COMMANDS_NAME_MAP.transferCrossChain]: t('Cross chain transfer'),
});

const splitModuleAndCommand = (moduleCommand) => moduleCommand.split(':');

const joinModuleAndCommand = ({ module, command }) => [module, command].join(':');

export {
  getModuleCommandTitle,
  joinModuleAndCommand,
  splitModuleAndCommand,
  getModuleCommandSenderLabel,
};
