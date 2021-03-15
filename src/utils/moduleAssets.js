import { MODULE_ASSETS } from '@constants';

const getModuleAssetSenderLabels = (t = str => str) => ({
  [MODULE_ASSETS.transfer]: t('Sender'),
  [MODULE_ASSETS.reclaimLSK]: t('Sender'),
  [MODULE_ASSETS.unlockToken]: t('Sender'),
  [MODULE_ASSETS.voteDelegate]: t('Voter'),
  [MODULE_ASSETS.registerDelegate]: t('Account nickname'),
  [MODULE_ASSETS.registerMultisignatureGroup]: t('Registrant'),
});

// eslint-disable-next-line import/prefer-default-export
export { getModuleAssetSenderLabels };
