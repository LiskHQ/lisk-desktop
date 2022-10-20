const moduleCommandNameMap = {
  transfer: 'token:transfer',
  crossChainTransfer: 'token:crossChaintransfer',
  registerMultisignature: 'auth:registerMultisignature',
  registerDelegate: 'dpos:registerDelegate',
  voteDelegate: 'dpos:voteDelegate',
  unlock: 'dpos:unlock',
  reportDelegateMisbehavior: 'dpos:reportDelegateMisbehavior',
  reclaim: 'legacy:reclaim',
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
    icon: 'unlockToken',
  },
  [moduleCommandNameMap.voteDelegate]: {
    maxFee: 1e8,
    icon: 'vote',
  },
  [moduleCommandNameMap.registerDelegate]: {
    maxFee: 25e8,
    icon: 'registerDelegate',
  },
  [moduleCommandNameMap.reportDelegateMisbehavior]: {
    maxFee: 1e7,
    icon: 'reportDelegateMisbehavior',
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

export {
  MODULE_COMMANDS_MAP,
  MODULE_COMMANDS_NAME_MAP,
};
