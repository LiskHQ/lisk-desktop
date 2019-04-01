/* eslint-disable no-bitwise */
/* eslint-disable */

import { ipcMain } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import win from './modules/win';
import {
  HWDevice,
  addConnectedDevices,
  removeConnectedDeviceByID,
  getDeviceById } from './hwManager';

const trezor = require('trezor.js'); // eslint-disable-line import/no-extraneous-dependencies

// set to true to see messages
const debug = false;
const logDebug = (...args) => {
  if (debug) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

// DeviceList encapsulates transports, sessions, device enumeration and other
// low-level things, and provides easy-to-use event interface.
const list = new trezor.DeviceList({ debug });

const createTrezorHWDevice = deviceFeatures =>
  new HWDevice(
    deviceFeatures.device_id,
    deviceFeatures.label,
    (deviceFeatures.model === '1' ? 'Trezor One' : 'Trezor Model T'),
    null,
  );

const hardeningConstant = 0x80000000;
const getHardenedPath = index => [
  (44 | hardeningConstant) >>> 0,
  (134 | hardeningConstant) >>> 0,
  (index | hardeningConstant) >>> 0,
];

/**
 * @param {string} label: Label of Trezor Device
 * @param {string} code: Codes are in the format ButtonRequest_[type]
 * where [type] is one of the types, defined here:
 * https://github.com/trezor/trezor-common/blob/master/protob/types.proto#L78-L89
 */
const buttonCallback = (label) => {
  logDebug('buttonCallback:', label);
  win.send({ event: 'trezorButtonCallback', value: label });
}; 

/**
 * @param {string} type
 * @param {Function<Error, string>} callback
 */
const pinCallback = (type, callback) => {
  logDebug('pinCallback:', type);
  win.send({ event: 'trezorPinCallback', value: null });
  ipcMain.once('trezorPinCallbackResponse', (event, pin) => {
    if (pin) {
      callback(null, pin);
    } else {
      callback('pin_not_provided_from_ui', null);
    }
  });
};

/**
 * @param {string} deviceId of Trezor
 * @param {Function<Error, string>} callback
 */
const passphraseCallback = (deviceId, callback) => {
  logDebug('passphraseCallback:', deviceId);
  // We check if we have saved it (Trezor One only)
  const td = getDeviceById(deviceId);
  if (td && td.pp) {
    callback(null, td.pp);
    return;
  }

  win.send({ event: 'trezorPassphraseCallback', value: null });

  ipcMain.once('trezorPassphraseCallbackResponse', (event, passphrase) => {
    if (passphrase || passphrase === '') {
      callback(null, passphrase);
      // Save passphrase in case of Trezor One (it asks on every action. Pretty annoying)
      const trezorDevice = getDeviceById(deviceId);
      if (trezorDevice && trezorDevice.model === 'Trezor One') {
        trezorDevice.pp = passphrase;
        removeConnectedDeviceByID(deviceId);
        addConnectedDevices(trezorDevice);
      }
    } else {
      callback('passphrase_not_provided_from_ui', null);
    }
  });
};

list.on('connect', (device) => {
  logDebug(`Connected device ${device.features.label}`);
  // logDebug('Connected a device:', device);
  // logDebug('Devices:', list.asArray());
  const deviceId = device.features.device_id;
  const deviceLabel = device.features.label;
  device.on('button', (code) => { buttonCallback(deviceLabel, code); });
  device.on('pin', pinCallback);
  device.on('passphrase', (callback) => { passphraseCallback(deviceId, callback); });
  device.on('disconnect', () => {
    logDebug(`Disconnected device ${device.features.label}`);
    const trezorDevice = getDeviceById(deviceId);
    if (trezorDevice) {
      win.send({ event: 'trezorDisconnected', value: trezorDevice });
      removeConnectedDeviceByID(trezorDevice.deviceId);
    }
  });

  // Filter out devices connected in bootloader mode
  if (device.isBootloader()) {
    logDebug(`Device ${device.features.label} is in bootloader mode.`);
    win.send({ event: 'trezorParamMessage', value: 'TREZOR_IS_IN_BOOTLOADER_MODE' });
    return;
  }

  // Filter out devices not initialized
  if (!device.isInitialized()) {
    logDebug(`Device ${device.features.label} is not initialized.`);
    win.send({ event: 'trezorParamMessage', value: 'TREZOR_IS_NOT_INITIALIZED' });
    return;
  }

  // Filter out devices with unsupported firmware versions
  if (device.features.model === '1' && !device.atLeast('1.7.1')) {
    logDebug(`Device ${device.features.label} firmware version not supported.`);
    win.send({ event: 'trezorParamMessage', value: 'TREZOR_ONE_OLD_FIRMWARE' });
    return;
  }
  if (device.features.model === 'T' && !device.atLeast('2.0.7')) {
    logDebug(`Device ${device.features.label} firmware version not supported.`);
    win.send({ event: 'trezorParamMessage', value: 'TREZOR_MODELT_OLD_FIRMWARE' });
    return;
  }

  logDebug(`Adding Device ${device.features.label} to connected devices.`);
  const trezorDevice = createTrezorHWDevice(device.features);
  console.log('trezorDevice', trezorDevice);
  addConnectedDevices(trezorDevice);
  win.send({ event: 'trezorConnected', value: trezorDevice });
});

// This gets called on general error of the devicelist (no transport, etc)
list.on('error', (error) => {
  logDebug('Trezor Error: ', error);
  win.send({ event: 'trezorError', value: error });
});

const askUserForceAcquire = callback => setTimeout(callback, 1000);

// On connecting unacquired device
list.on('connectUnacquired', (device) => {
  askUserForceAcquire(() => {
    device.steal().then(() => { logDebug(`Steal done for Device ${device.features.label}.`); });
  });
});

// Release on exit
process.on('exit', () => {
  list.onbeforeunload();
});

/** Trezor Transaction Grammar
 *  type -> UVarintType -> OK
 *  amount -> UVarintType -> string to int
 *  fee -> UVarintType -> string to int
 *  recipient_id -> UnicodeType -> coming in 'recipientId'
 *  sender_public_key -> BytesType -> coming in 'senderPublicKey'
 *  requester_public_key -> BytesType -> coming in 'requesterPublicKey'
 *  signature -> BytesType -> OK
 *  timestamp -> UVarintType -> OK
 *
 *  asset -> LiskTransactionAsset
 *    signature -> LiskSignatureType
 *      public_key -> BytesType -> coming in 'publicKey'
 *    delegate -> LiskDelegateType
 *      username -> UnicodeType -> OK
 *    votes -> UnicodeType -> OK
 *    multisignature -> LiskMultisignatureType
 *      min -> UVarintType -> TODO
 *      life_time -> UVarintType -> TODO
 *      keys_group -> UnicodeType -> TODO
 *    data -> UnicodeType -> OK
 */
const toTrezorGrammar = (tx) => {
  if (tx.amount) {
    tx.amount = parseInt(tx.amount, 10);
  }
  if (tx.fee) {
    tx.fee = parseInt(tx.fee, 10);
  }
  if (tx.recipientId === '') {
    delete tx.recipientId;
  }
  if (tx.recipientId) {
    tx.recipient_id = tx.recipientId;
    delete tx.recipientId;
  }
  if (tx.senderPublicKey) {
    tx.sender_public_key = tx.senderPublicKey;
    delete tx.senderPublicKey;
  }
  if (tx.requesterPublicKey) {
    tx.requester_public_key = tx.requesterPublicKey;
    delete tx.requesterPublicKey;
  }
  if (tx.asset) {
    if (tx.asset.signature && tx.asset.signature.publicKey) {
      tx.asset.signature.public_key = tx.asset.signature.publicKey;
      delete tx.asset.signature.publicKey;
    }
  }
  return tx;
};

// eslint-disable-next-line import/prefer-default-export
export const executeTrezorCommand = (device, command) => {
  logDebug('Executing Command', device, command);
  const tDevice = list.asArray().find(d => d.features.device_id === device.deviceId);
  if (!tDevice) {
    return Promise.reject('DEVICE_IS_NOT_CONNECTED');
  }
  return tDevice.waitForSessionAndRun(async (session) => {
    try {
      let res;

      if (command.action === 'GET_PUBLICKEY') {
        const resTrezor = await session.typedCall(
          'LiskGetPublicKey',
          'LiskPublicKey',
          {
            address_n: getHardenedPath(command.data.index),
            show_display: command.data.showOnDevice,
          });
        res = resTrezor.message.public_key;
      }

      if (command.action === 'GET_ACCOUNT') {
        const resTrezor = await session.typedCall(
          'LiskGetPublicKey',
          'LiskPublicKey',
          {
            address_n: getHardenedPath(command.data.index),
            show_display: false,
          });
        res = { publicKey: resTrezor.message.public_key };
      }
      if (command.action === 'SIGN_MSG') {
        const resTrezor = await session.typedCall(
          'LiskSignMessage',
          'LiskMessageSignature',
          {
            address_n: getHardenedPath(command.data.index),
            message: new Buffer(command.data.message, 'utf8').toString('hex'),
          });
        res = resTrezor.message.signature;
      }
      if (command.action === 'SIGN_TX') {
        const resTrezor = await session.typedCall(
          'LiskSignTx',
          'LiskSignedTx',
          {
            address_n: getHardenedPath(command.data.index),
            transaction: toTrezorGrammar(command.data.tx),
          });
        res = resTrezor.message.signature;
      }
      return Promise.resolve(res);
    } catch (e) {
      logDebug('Error during execution of command', e);
      if (e.message === 'PIN cancelled' ||
        e.message === 'Cancelled' ||
        e.message === 'Signing cancelled') {
        return Promise.reject('TREZOR_ACTION_DENIED_BY_USER');
      }
      return Promise.reject('ERROR_OR_DEVICE_IS_NOT_CONNECTED');
    }
  });
};
