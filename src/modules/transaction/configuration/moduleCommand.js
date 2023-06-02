const moduleCommandNameMap = {
  registerMultisignature: 'auth:registerMultisignature',
  submitMainchainCrossChainUpdate: 'interoperability:submitMainchainCrossChainUpdate',
  initializeMessageRecovery: 'interoperability:initializeMessageRecovery',
  recoverMessage: 'interoperability:recoverMessage',
  registerSidechain: 'interoperability:registerSidechain',
  recoverState: 'interoperability:recoverState',
  terminateSidechainForLiveness: 'interoperability:terminateSidechainForLiveness',
  reclaimLSK: 'legacy:reclaimLSK',
  registerKeys: 'legacy:registerKeys',
  registerValidator: 'pos:registerValidator',
  reportMisbehavior: 'pos:reportMisbehavior',
  unlock: 'pos:unlock',
  updateGeneratorKey: 'pos:updateGeneratorKey',
  stake: 'pos:stake',
  changeCommission: 'pos:changeCommission',
  claimRewards: 'pos:claimRewards',
  transfer: 'token:transfer',
  transferCrossChain: 'token:transferCrossChain',
  reportValidatorMisbehavior: 'pos:reportMisbehavior',
};

const moduleCommandMap = {
  [moduleCommandNameMap.transfer]: {
    maxFee: 1e7,
    icon: 'txDefault',
  },
  [moduleCommandNameMap.transferCrossChain]: {
    maxFee: 1e7,
    icon: 'txDefault',
  },
  [moduleCommandNameMap.unlock]: {
    maxFee: 1e7,
    icon: 'unlock',
  },
  [moduleCommandNameMap.claimRewards]: {
    maxFee: 1e7,
    icon: 'commissionsIcon',
  },
  [moduleCommandNameMap.stake]: {
    maxFee: 1e8,
    icon: 'stake',
  },
  [moduleCommandNameMap.registerValidator]: {
    maxFee: 25e8,
    icon: 'registerValidator',
  },
  [moduleCommandNameMap.reportMisbehavior]: {
    maxFee: 1e7,
    icon: 'reportValidatorMisbehavior',
  },
  [moduleCommandNameMap.registerMultisignature]: {
    maxFee: 5e8,
    icon: 'multisignatureTransaction',
  },
  [moduleCommandNameMap.reclaimLSK]: {
    maxFee: 1e7,
    icon: 'txDefault',
  },
  [moduleCommandNameMap.changeCommission]: {
    maxFee: 1e7,
    icon: 'commissionsIcon',
  },
};

const MODULE_COMMANDS_NAME_MAP = Object.freeze(moduleCommandNameMap);
const MODULE_COMMANDS_MAP = Object.freeze(moduleCommandMap);

export { MODULE_COMMANDS_MAP, MODULE_COMMANDS_NAME_MAP };
