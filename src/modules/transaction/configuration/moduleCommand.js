const moduleCommandNameMap = {
  transfer: 'token:transfer',
  crossChainTransfer: 'token:crossChaintransfer',
  registerMultisignature: 'auth:registerMultisignature',
  registerValidator: 'pos:registerValidator',
  stake: 'pos:stake',
  unlock: 'pos:unlock',
  reportDelegateMisbehavior: 'pos:reportMisbehavior',
  reclaim: 'legacy:reclaimLSK',
};

const moduleCommandMap = {
  [moduleCommandNameMap.transfer]: {
    maxFee: 1e7,
    icon: 'txDefault',
  },
  [moduleCommandNameMap.crossChainTransfer]: {
    maxFee: 1e7,
    icon: 'txDefault',
  },
  [moduleCommandNameMap.unlock]: {
    maxFee: 1e7,
    icon: 'unlock',
  },
  [moduleCommandNameMap.stake]: {
    maxFee: 1e8,
    icon: 'stake',
  },
  [moduleCommandNameMap.registerValidator]: {
    maxFee: 25e8,
    icon: 'registerValidator',
  },
  [moduleCommandNameMap.reportDelegateMisbehavior]: {
    maxFee: 1e7,
    icon: 'reportValidatorMisbehavior',
  },
  [moduleCommandNameMap.registerMultisignature]: {
    maxFee: 5e8,
    icon: 'multisignatureTransaction',
  },
  [moduleCommandNameMap.reclaim]: {
    maxFee: 1e7,
    icon: 'txDefault',
  },
};

const MODULE_COMMANDS_NAME_MAP = Object.freeze(moduleCommandNameMap);
const MODULE_COMMANDS_MAP = Object.freeze(moduleCommandMap);

export { MODULE_COMMANDS_MAP, MODULE_COMMANDS_NAME_MAP };
