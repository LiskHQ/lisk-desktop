/* eslint-disable */
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TrezorConnect from 'trezor-connect';
import i18next from 'i18next';
import { LedgerAccount, SupportedCoin, DposLedger } from 'dpos-ledger-api';
import to from 'await-to-js';
import { HW_CMD, calculateSecondPassphraseIndex } from '../../constants/hwConstants';
import { loadingStarted, loadingFinished } from '../loading';
import { infoToastDisplayed, errorToastDisplayed } from '../../actions/toaster';
import { getTransactionBytes, calculateTxId, getBufferToHex, createSendTX, createRawVoteTX } from '../rawTransactionWrapper';
import { PLATFORM_TYPES, getPlatformType } from '../platform';
import store from '../../store';

import { getAccount } from './lsk/account';
import { extractAddress } from '../account';
import { getVotes } from './delegate';
import { getTransactions } from './lsk/transactions';

import loginTypes from '../../constants/loginTypes';
import { HW_MSG, models, loginType } from '../../constants/hwConstants';
import { getAPIClient } from './lsk/network';

const util = require('util');

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
    if (command.hwType === loginType.ledger) {
      resCommand = await executeLedgerCommandForWeb(command);
    } else if (command.hwType === loginType.trezor) {
      resCommand = await executeTrezorCommandForWeb(command);
    } else {
      throw new Error(i18next.t('Hardware Wallet Type not recognized'));
    }
    return resCommand;
  }
  throw new Error(HW_MSG.NO_TRANSPORT_AVAILABLE);
};

export const getLoginTypeFromDevice = (device) => {
  if (device.model === models.ledgerNanoS) {
    return loginTypes.ledgerNano;
  } else if (device.model === models.trezorOne || device.model === models.trezorModelT) {
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


export const getHWAccountInfo = async (activePeer, deviceId, loginType, accountIndex) => {
  let error;
  let publicKey;

  [error, publicKey] = await to(getHWPublicKeyFromIndex(deviceId, loginType, accountIndex));
  if (error) {
    throw error;
  }

  const address = extractAddress(publicKey);
  let resAccount = await getAccount({ liskAPIClient: activePeer, address });

  const isInitialized = !!resAccount.unconfirmedBalance;
  Object.assign(resAccount, { isInitialized });
  Object.assign(resAccount, { isInitialized, publicKey });

  return resAccount;
};


/**
 * Trigger this action to sign and broadcast a SendTX with Ledger Account
 * NOTE: secondPassphrase for ledger is a PIN (numeric)
 * @returns Promise - Action Send with Ledger
 */
/* eslint-disable prefer-const */
export const sendWithHW = (networkConfig, account, recipientId, amount,
  pin = null, data = null) =>
  new Promise(async (resolve, reject) => {
    const rawTx = createSendTX(account.publicKey, recipientId, amount, data);
    let error;
    let signedTx;
    [error, signedTx] = await to(signTransactionWithHW(rawTx, account, pin));

    if (error) {
      reject(error);
    } else {
      getAPIClient(networkConfig).transactions.broadcast(signedTx).then(() => {
        resolve(signedTx);
      }).catch(reject);
    }
  });

/**
 * Trigger this action to sign and broadcast a VoteTX with Ledger Account
 * NOTE: secondPassphrase for ledger is a PIN (numeric)
 * @returns Promise - Action Vote with Ledger
 */
export const voteWithHW = (activePeer, account, votedList, unvotedList, pin = null) =>
  new Promise(async (resolve, reject) => {
    const rawTx = createRawVoteTX(account.publicKey, account.address, votedList, unvotedList);
    let error;
    let signedTx;
    [error, signedTx] = await to(signTransactionWithHW(rawTx, account, pin));
    if (error) {
      reject(error);
    } else {
      activePeer.transactions.broadcast(signedTx).then(() => {
        resolve(signedTx);
      }).catch(reject);
    }
  });
