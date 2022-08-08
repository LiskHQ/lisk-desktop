import { cryptography } from '@liskhq/lisk-client';

// TODO: Fix the mapping based on new id changes
// We will address these problem in issue https://github.com/LiskHQ/lisk-desktop/issues/4400

const modules = {
  token: 2,
  dpos: 5,
  multiSignature: 4,
  legacyAccount: 1000,
};

const commands = {
  transfer: 0,
  registerDelegate: 0,
  voteDelegate: 1,
  unlockToken: 2,
  registerMultisignatureGroup: 0,
  reclaimLSK: 0,
  reportDelegateMisbehavior: 3,
};

const moduleCommandNameIdMap = {
  transfer: `${modules.token}:${commands.transfer}`,
  unlockToken: `${modules.dpos}:${commands.unlockToken}`,
  voteDelegate: `${modules.dpos}:${commands.voteDelegate}`,
  registerDelegate: `${modules.dpos}:${commands.registerDelegate}`,
  reportDelegateMisbehavior: `${modules.dpos}:${commands.reportDelegateMisbehavior}`,
  registerMultisignatureGroup: `${modules.multiSignature}:${commands.registerMultisignatureGroup}`,
  reclaimLSK: `${modules.legacyAccount}:${commands.reclaimLSK}`,
};

const moduleCommandMap = {
  [moduleCommandNameIdMap.transfer]: {
    maxFee: 1e7,
    icon: 'txDefault',
  },
  [moduleCommandNameIdMap.unlockToken]: {
    maxFee: 1e7,
    icon: 'unlockToken',
  },
  [moduleCommandNameIdMap.voteDelegate]: {
    maxFee: 1e8,
    icon: 'vote',
  },
  [moduleCommandNameIdMap.registerDelegate]: {
    maxFee: 25e8,
    icon: 'registerDelegate',
  },
  [moduleCommandNameIdMap.reportDelegateMisbehavior]: {
    maxFee: 1e7,
    icon: 'reportDelegateMisbehavior',
  },
  [moduleCommandNameIdMap.registerMultisignatureGroup]: {
    maxFee: 5e8,
    icon: 'multisignatureTransaction',
  },
  [moduleCommandNameIdMap.reclaimLSK]: {
    maxFee: 1e7,
    icon: 'txDefault',
  },
};

const MODULE_COMMANDS_NAME_ID_MAP = Object.freeze(moduleCommandNameIdMap);
const MODULE_COMMANDS_MAP = Object.freeze(moduleCommandMap);
const BASE_FEES = [
  Object.freeze({
    moduleID: cryptography.utils.intToBuffer(modules.dpos, 4),
    commandID: cryptography.utils.intToBuffer(commands.registerDelegate, 4),
    baseFee: '1000000000',
  }),
];

export {
  BASE_FEES,
  MODULE_COMMANDS_MAP,
  MODULE_COMMANDS_NAME_ID_MAP,
};
