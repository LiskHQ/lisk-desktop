import { cryptography } from '@liskhq/lisk-client';
import { MODULE_COMMANDS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';

// TODO: Fix the mapping based on new id changes
// We will address these problem in issue https://github.com/LiskHQ/lisk-desktop/issues/4400

const getModuleCommandSenderLabel = (t = (str) => str) => ({
  [MODULE_COMMANDS_NAME_ID_MAP.transfer]: t('Sender'),
  [MODULE_COMMANDS_NAME_ID_MAP.reclaimLSK]: t('Sender'),
  [MODULE_COMMANDS_NAME_ID_MAP.unlockToken]: t('Sender'),
  [MODULE_COMMANDS_NAME_ID_MAP.voteDelegate]: t('Voter'),
  [MODULE_COMMANDS_NAME_ID_MAP.registerDelegate]: t('Account username'),
  [MODULE_COMMANDS_NAME_ID_MAP.registerMultisignatureGroup]: t('Registrant'),
  [MODULE_COMMANDS_NAME_ID_MAP.reportDelegateMisbehavior]: t('Reporter'),
});

const getModuleCommandTitle = (t = (str) => str) => ({
  [MODULE_COMMANDS_NAME_ID_MAP.transfer]: t('Send'),
  [MODULE_COMMANDS_NAME_ID_MAP.reclaimLSK]: t('Reclaim'),
  [MODULE_COMMANDS_NAME_ID_MAP.unlockToken]: t('Unlock'),
  [MODULE_COMMANDS_NAME_ID_MAP.voteDelegate]: t('Vote'),
  [MODULE_COMMANDS_NAME_ID_MAP.registerDelegate]: t('Register delegate'),
  [MODULE_COMMANDS_NAME_ID_MAP.registerMultisignatureGroup]: t('Register multisignature group'),
  [MODULE_COMMANDS_NAME_ID_MAP.reportDelegateMisbehavior]: t('Report delegate misbehaviour'),
});

const splitModuleAndCommandIds = (moduleCommandID) => {
  const [moduleID, commandID] = moduleCommandID.split(':');
  return [
    cryptography.utils.intToBuffer(moduleID, 4),
    cryptography.utils.intToBuffer(commandID, 4),
  ];
};

const joinModuleAndCommandIds = ({ moduleID, commandID }) => [moduleID, commandID].join(':');

export {
  getModuleCommandTitle,
  joinModuleAndCommandIds,
  splitModuleAndCommandIds,
  getModuleCommandSenderLabel,
};
