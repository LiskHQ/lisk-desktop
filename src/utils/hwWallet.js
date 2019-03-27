import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TrezorConnect from 'trezor-connect';
import i18next from 'i18next';
import { LedgerAccount, SupportedCoin, DposLedger } from 'dpos-ledger-api';
import { HW_CMD, calculateSecondPassphraseIndex } from '../constants/hwConstants';
import { loadingStarted, loadingFinished } from './loading';
import { infoToastDisplayed, errorToastDisplayed } from '../actions/toaster';
import { getTransactionBytes, calculateTxId, getBufferToHex } from './rawTransactionWrapper';
import { PLATFORM_TYPES, getPlatformType } from './platform';
import store from '../store';
import loginTypes from '../constants/loginTypes';

const util = require('util');

export const HW_MSG = {
  ERROR_OR_DEVICE_IS_NOT_CONNECTED: i18next.t('Error or Device Not Connected.'),
  NO_TRANSPORT_AVAILABLE: i18next.t('Unable to detect the communication layer with your Hardware Wallet'),

  LEDGER_CONNECTED: i18next.t('Ledger Nano S Connected.'),
  LEDGER_DISCONNECTED: i18next.t('Ledger Nano S Disconnected.'),
  LEDGER_NO_TRANSPORT_AVAILABLE_U2F: i18next.t('Unable to detect the communication layer. Is ledger connected? Is Fido U2F Extension Installed?'),
  LEDGER_ERR_DURING_CONNECTION: i18next.t('Error on Ledger Connection. Be sure your device is connected properly'),
  LEDGER_ACTION_DENIED_BY_USER: i18next.t('Action Denied by User'),
  LEDGER_ASK_FOR_CONFIRMATION: i18next.t('Look at your Ledger for confirmation'),

  TREZOR_CONNECTED: i18next.t('%s Connected. Welcome %s!'),
  TREZOR_DISCONNECTED: i18next.t('%s Disconnected. See you %s!'),
  TREZOR_ASK_FOR_CONFIRMATION: i18next.t('Look at your Trezor %s for completing the action'),
  TREZOR_ACTION_DENIED_BY_USER: i18next.t('Action Denied by User'),
  TREZOR_IS_IN_BOOTLOADER_MODE: i18next.t('Your Trezor Device is in bootloader mode, please re-connected it.'),
  TREZOR_IS_NOT_INITIALIZED: i18next.t('Your Trezor Device is not initialized. Please do it with trezor software.'),
  TREZOR_ONE_OLD_FIRMWARE: i18next.t('Your Trezor One has an old Firmware. Please update it.'),
  TREZOR_MODELT_OLD_FIRMWARE: i18next.t('Your Trezor Model T has an old Firmware. Please update it.'),
};

const { ipc } = window;

if (ipc) { // On browser-mode is undefined
  ipc.on('ledgerConnected', () => {
    store.dispatch(infoToastDisplayed({ label: HW_MSG.LEDGER_CONNECTED }));
  });

  ipc.on('ledgerDisconnected', () => {
    store.dispatch(errorToastDisplayed({ label: HW_MSG.LEDGER_DISCONNECTED }));
  });

  ipc.on('ledgerButtonCallback', () => {
    store.dispatch(infoToastDisplayed({ label: HW_MSG.LEDGER_ASK_FOR_CONFIRMATION }));
  });

  ipc.on('trezorConnected', (event, data) => {
    store.dispatch(infoToastDisplayed({
      label: util.format(HW_MSG.TREZOR_CONNECTED, data.model, data.label),
    }));
  });

  ipc.on('trezorDisconnected', (event, data) => {
    store.dispatch(errorToastDisplayed({
      label: util.format(HW_MSG.TREZOR_DISCONNECTED, data.model, data.label),
    }));
  });

  ipc.on('trezorButtonCallback', (event, data) => {
    store.dispatch(infoToastDisplayed({
      label: util.format(HW_MSG.TREZOR_ASK_FOR_CONFIRMATION, data),
    }));
  });

  ipc.on('trezorParamMessage', (event, data) => {
    store.dispatch(errorToastDisplayed({ label: HW_MSG[data] }));
  });

  ipc.on('trezorError', () => {
    store.dispatch(errorToastDisplayed({ label: HW_MSG.ERROR_OR_DEVICE_IS_NOT_CONNECTED }));
  });
}

const getLedgerTransportU2F = async () => TransportU2F.create();

export const getLedgerAccount = (index = 0) => {
  const ledgerAccount = new LedgerAccount();
  ledgerAccount.coinIndex(SupportedCoin.LISK);
  ledgerAccount.account(index);
  return ledgerAccount;
};

const sendIpcCommand = command =>
  new Promise((resolve, reject) => {
    ipc.once('hwCommand.result', (event, res) => {
      if (res.success) {
        return resolve(res.data);
      }
      return reject(new Error(HW_MSG[res.errorKey]));
    });
    ipc.send('hwCommand.request', command);
  });

export const getDeviceList = () =>
  new Promise((resolve) => {
    const platform = getPlatformType();
    if (platform === PLATFORM_TYPES.ELECTRON) {
      ipc.once('getConnectedDevicesList.result', (event, res) => resolve(res.data));
      ipc.send('getConnectedDevicesList.request', null);
    } else {
      // Browser mode, only dev purpose
      const deviceList = [];
      deviceList.push({ deviceId: 0, label: 'FakeLedger', model: 'Ledger Nano S', path: '/fake/path' });
      deviceList.push({ deviceId: 1, label: 'FakeTrezorT', model: 'Trezor Model T', path: null });
      deviceList.push({ deviceId: 2, label: 'FakeTrezor1', model: 'Trezor One', path: null });
      resolve(deviceList);
    }
  });

const getFullDerivationPath = index => `m/44'/134'/${index}'`;

const executeLedgerCommandForWeb = async (command) => {
  let transport = null;
  try {
    transport = await getLedgerTransportU2F();
  } catch (e) {
    throw new Error(HW_MSG.LEDGER_NO_TRANSPORT_AVAILABLE_U2F);
  }

  try {
    const liskLedger = new DposLedger(transport);
    const ledgerAccount = getLedgerAccount(command.data.index);
    let cmdRes;
    if (command.action === HW_CMD.GET_PUBLICKEY) {
      cmdRes = await liskLedger.getPubKey(ledgerAccount, command.data.showOnDevice);
      cmdRes = cmdRes.publicKey;
    }
    if (command.action === HW_CMD.GET_ADDRESS) {
      cmdRes = await liskLedger.getPubKey(ledgerAccount, command.data.showOnDevice);
      cmdRes = cmdRes.address;
    }
    if (command.action === HW_CMD.SIGN_MSG) {
      const signature = await liskLedger.signMSG(ledgerAccount, command.data.message);
      cmdRes = getBufferToHex(signature.slice(0, 64));
    }
    if (command.action === HW_CMD.SIGN_TX) {
      const signature = await liskLedger.signTX(ledgerAccount,
        getTransactionBytes(command.data.tx), false);
      cmdRes = getBufferToHex(signature);
    }
    transport.close();
    return cmdRes;
  } catch (err) {
    if (err.statusText && err.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
      throw new Error(HW_MSG.LEDGER_ACTION_DENIED_BY_USER);
    } else {
      throw new Error(HW_MSG.ERROR_OR_DEVICE_IS_NOT_CONNECTED);
    }
  }
};

const throwIfNotSuccess = (cmdRes) => {
  if (!cmdRes.success) {
    throw new Error(HW_MSG.TREZOR_ACTION_DENIED_BY_USER);
  }
  return cmdRes;
};

const executeTrezorCommandForWeb = async (command) => {
  try {
    const params = {
      path: getFullDerivationPath(command.data.index),
    };
    let cmdRes;
    if (command.action === HW_CMD.GET_PUBLICKEY) {
      params.showOnTrezor = command.data.showOnDevice;
      cmdRes = await TrezorConnect.liskGetPublicKey(params);
      cmdRes = throwIfNotSuccess(cmdRes).payload.publicKey;
    }
    if (command.action === HW_CMD.GET_ADDRESS) {
      params.showOnTrezor = command.data.showOnDevice;
      cmdRes = await TrezorConnect.liskGetAddress(params);
      cmdRes = throwIfNotSuccess(cmdRes).payload.address;
    }
    if (command.action === HW_CMD.SIGN_MSG) {
      params.message = command.data.message;
      cmdRes = await TrezorConnect.liskSignMessage(params);
      cmdRes = throwIfNotSuccess(cmdRes).payload.signature;
    }
    if (command.action === HW_CMD.SIGN_TX) {
      params.transaction = command.data.tx;
      cmdRes = await TrezorConnect.liskSignTransaction(params);
      cmdRes = throwIfNotSuccess(cmdRes).payload.signature;
    }
    return cmdRes;
  } catch (err) {
    if (err.statusText && err.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
      throw new Error(HW_MSG.TREZOR_ACTION_DENIED_BY_USER);
    }
    throw new Error(HW_MSG.ERROR_OR_DEVICE_IS_NOT_CONNECTED);
  }
};

const platformHendler = async (command) => {
  const platform = getPlatformType();

  if (platform === PLATFORM_TYPES.ELECTRON) {
    return sendIpcCommand(command);
  }

  if (platform === PLATFORM_TYPES.BROWSER) { // Used only during dev.
    let resCommand;
    if (command.hwType === loginTypes.ledgerNano) {
      resCommand = await executeLedgerCommandForWeb(command);
    } else if (command.hwType === loginTypes.trezor) {
      resCommand = await executeTrezorCommandForWeb(command);
    } else {
      throw new Error(i18next.t('Hardware Wallet Type not recognized'));
    }
    return resCommand;
  }
  throw new Error(HW_MSG.NO_TRANSPORT_AVAILABLE);
};

export const getLoginTypeFromDevice = (device) => {
  if (device.model === 'Ledger Nano S') {
    return loginTypes.ledgerNano;
  } else if (device.model === 'Trezor One' || device.model === 'Trezor Model T') {
    return loginTypes.trezor;
  }
  return null;
};

export const getHWPublicKeyFromIndex = async (deviceId, loginType, index, showOnDevice = false) => {
  const command = {
    action: HW_CMD.GET_PUBLICKEY,
    hwType: loginType,
    data: { deviceId, index, showOnDevice },
  };
  return platformHendler(command);
};

export const getHWAddressFromIndex = async (deviceId, loginType, index, showOnDevice = false) => {
  const command = {
    action: HW_CMD.GET_ADDRESS,
    hwType: loginType,
    data: { deviceId, index, showOnDevice },
  };
  return platformHendler(command);
};

export const signMessageWithHW = async (account, message) => {
  const command = {
    action: HW_CMD.SIGN_MSG,
    hwType: account.loginType,
    data: {
      deviceId: account.hwInfo.deviceId,
      index: account.hwInfo.derivationIndex,
      message,
    },
  };
  return platformHendler(command);
};

/* eslint-disable prefer-const */
export const signTransactionWithHW = async (tx, account, pin) => {
  const command = {
    action: HW_CMD.SIGN_TX,
    hwType: account.loginType,
    data: {
      deviceId: account.hwInfo.deviceId,
      index: account.hwInfo.derivationIndex,
      tx,
    },
  };

  loadingStarted('ledgerUserAction');

  let signature;
  try {
    signature = await platformHendler(command);
  } catch (err) {
    loadingFinished('ledgerUserAction');
    throw err;
  }

  tx.signature = signature;
  loadingFinished('ledgerUserAction');

  // In case of second signature (PIN)
  if (typeof pin === 'string' && pin !== '') {
    const command2 = {
      action: HW_CMD.SIGN_TX,
      hwType: account.loginType,
      data: {
        deviceId: account.hwInfo.deviceId,
        index: calculateSecondPassphraseIndex(account.hwInfo.derivationIndex, pin),
        tx,
      },
    };

    loadingStarted('ledgerUserAction');

    let signSignature;
    try {
      signSignature = await platformHendler(command2);
    } catch (err) {
      loadingFinished('ledgerUserAction');
      throw err;
    }

    tx.signSignature = signSignature;
    loadingFinished('ledgerUserAction');
  }

  tx.id = calculateTxId(tx);
  return tx;
};
