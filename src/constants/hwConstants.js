import i18next from 'i18next';

export const hwConstants = {
  secondPassphraseOffset: 1e5,
};
export const LEDGER_COMMANDS = {
  GET_ACCOUNT: 'GET_ACCOUNT',
  SIGN_MSG: 'SIGN_MSG',
  SIGN_TX: 'SIGN_TX',
};

export const loginType = {
  normal: 0,
  ledger: 1,
  trezor: 2,
};

export const HW_CMD = {
  GET_PUBLICKEY: 'GET_PUBLICKEY',
  GET_ADDRESS: 'GET_ADDRESS',
  SIGN_MSG: 'SIGN_MSG',
  SIGN_TX: 'SIGN_TX',
};

export const models = {
  ledgerNanoS: 'Ledger Nano S',
  ledgerNanoX: 'Ledger Nano X',
  trezorOne: 'Trezor One',
  trezorModelT: 'Trezor Model T',
};

export const calculateSecondPassphraseIndex = (accountIndex, pin) => (
  accountIndex + parseInt(pin, 10) + hwConstants.secondPassphraseOffset
);

export const HW_MSG = {
  ERROR_OR_DEVICE_IS_NOT_CONNECTED: i18next.t('Error or Device Not Connected.'),
  NO_TRANSPORT_AVAILABLE: i18next.t('Unable to detect the communication layer with your Hardware Wallet'),

  LEDGER_CONNECTED: i18next.t('{{walletModel}} connected', { walletModel: models.ledgerNanoS }),
  LEDGER_DISCONNECTED: i18next.t('{{walletModel}} disconnected', { walletModel: models.ledgerNanoS }),
  LEDGER_NO_TRANSPORT_AVAILABLE_U2F: i18next.t('Unable to detect the communication layer. Is ledger connected? Is Fido U2F Extension Installed?'),
  LEDGER_ERR_DURING_CONNECTION: i18next.t('Error on Ledger Connection. Be sure your device is connected properly'),
  LEDGER_ACTION_DENIED_BY_USER: i18next.t('Action Denied by User'),
  LEDGER_ASK_FOR_CONFIRMATION: i18next.t('Look at your Ledger for confirmation'),

  TREZOR_CONNECTED: i18next.t('%s connected. Welcome %s!'),
  TREZOR_DISCONNECTED: i18next.t('%s disconnected. See you %s!'),
  TREZOR_ASK_FOR_CONFIRMATION: i18next.t('Look at your Trezor %s for completing the action'),
  TREZOR_ACTION_DENIED_BY_USER: i18next.t('Action Denied by User'),
  TREZOR_IS_IN_BOOTLOADER_MODE: i18next.t('Your Trezor Device is in bootloader mode, please re-connected it.'),
  TREZOR_IS_NOT_INITIALIZED: i18next.t('Your Trezor Device is not initialized. Please do it with trezor software.'),
  TREZOR_ONE_OLD_FIRMWARE: i18next.t('Your {{walletModel}} has an old Firmware. Please update it.', { walletModel: models.trezorOne }),
  TREZOR_MODELT_OLD_FIRMWARE: i18next.t('Your {{walletModel}} has an old Firmware. Please update it.', { walletModel: models.trezorModelT }),
};
