/* istanbul ignore file */
import { LedgerAccount, LiskApp } from '@zondax/ledger-lisk';
import { transactions } from '@liskhq/lisk-client';

import { ADD_DEVICE, DEVICE_STATUS } from '../../constants';
import { LEDGER } from './constants';

// ============================================ //
//              DEVICES LIST
// ============================================ //
let devices = [];

/**
 * addDevice - function - Add a new device to the devices list.
 * @param {object} device - Device object coming from the ledger library
 * @param {string} path - Path of the device used for the library to recognize it (descriptor)
 * @param {function} add - Function that use for main file to include the device in the main list.
 */
const addDevice = (device, path, { add }) => {
  const newDevice = {
    deviceId: `${Math.floor(Math.random() * 1e5) + 1}`,
    label: device.productName,
    model: device.productName,
    path,
    manufacturer: LEDGER.name,
  };

  devices.push(newDevice);
  add(newDevice);
};

/**
 * removeDevice - function - Remove a device from the main list and the device array.
 * @param {object} transport - Library use for get information about ledger.
 * @param {function} remove - Function for remove a device from the main list.
 */
const removeDevice = async (transport, { remove }) => {
  const connectedPaths = await transport.list();
  devices
    .filter((device) => !connectedPaths.includes(device.path))
    .forEach((device) => remove(device.path));
  devices = devices.filter((device) => connectedPaths.includes(device.path));
};

/**
 * listener - function - Always listen for new messages for connect or disconnect devices.
 * @param {object} transport - Library use for handle the ledger devices.
 * @param {object} actions - Contains 2 functions: add and remove.
 * @param {function} actions.add - Function for add a new device to the main list.
 * @param {function} actions.remove - Function for remove a device from the main list.
 */
const listener = (transport, actions) => {
  transport.listen({
    next: ({ type, deviceModel, descriptor }) => {
      if (deviceModel && descriptor) {
        if (type === ADD_DEVICE) addDevice(deviceModel, descriptor, actions);
        removeDevice(transport, actions);
      }
    },
  });
};

/**
 * getLedgerAccount - function - Check if account exist for selected coin
 * @param {number} index - index for the desired account, if no value is provided use default (0)
 */
const getLedgerAccount = (index = 0) => {
  const ledgerAccount = new LedgerAccount();
  ledgerAccount.account(index);
  return ledgerAccount;
};

/**
 * checkLiskAppStatus - function - Validate if after using the pin to unblock ledger device
 * the user is inside the LSK App, if not then will show the device as connected but not
 * able to get accounts from the device.
 * @param {object} param - Object with 2 elements, a transport and device.
 * @param {object} param.transporter - Object for handle the ledger device.
 * @param {object} param.device - Object with device information.
 */
// eslint-disable-next-line max-statements
const checkLiskAppStatus = async ({ transporter, path }) => {
  let transport;
  let status
  try {
    transport = await transporter.open(path);
    const liskLedger = new LiskApp(transport);
    const ledgerAccount = getLedgerAccount(0);
    const { pubKey } = await liskLedger.getAddressAndPubKey(ledgerAccount.derivePath());
    status = pubKey ? DEVICE_STATUS.CONNECTED : DEVICE_STATUS.STAND_BY;
  } catch (e) {
    status = DEVICE_STATUS.DISCONNECTED;
  }
  if (transport) transport.close();
  return status;
};

// eslint-disable-next-line max-statements
const getPublicKey = async (transporter, { device, data }) => {
  let transport = null;
  try {
    transport = await transporter.open(device.path);
    const liskLedger = new LiskApp(transport);
    const ledgerAccount = getLedgerAccount(data.index);
    const response = data.showOnDevice
      ? await liskLedger.showAddressAndPubKey(ledgerAccount.derivePath())
      : await liskLedger.getAddressAndPubKey(ledgerAccount.derivePath());
    transport.close();
    return response.pubKey;
  } catch (error) {
    if (transport) transport.close();
    throw error;
  }
};

const getAddress = async (transporter, { device, data }) => {
  let transport = null;
  try {
    transport = await transporter.open(device.path);
    const liskLedger = new LiskApp(transport);
    const ledgerAccount = getLedgerAccount(data.index);
    const { address } = await liskLedger.getAddressAndPubKey(ledgerAccount.derivePath());
    transport.close();
    return address;
  } catch (error) {
    transport?.close();
    throw error;
  }
};

// eslint-disable-next-line max-statements
const signTransaction = async (transporter, { device, data }) => {
  let transport = null;
  try {
    transport = await transporter.open(device.path);
    const liskLedger = new LiskApp(transport);
    const ledgerAccount = getLedgerAccount(data.index);
    const signature = await liskLedger.sign(ledgerAccount.derivePath(), Buffer.from(data.message, 'hex'));
    transport.close();
    return signature;
  } catch (error) {
    if (transport) transport.close();
    throw new Error(error);
  }
};

const signMessage = async (transporter, { device, data }) => {
  let transport = null;
  try {
    transport = await transporter.open(device.path);
    const liskLedger = new LiskApp(transport);
    const ledgerAccount = getLedgerAccount(data.index);
    // derivation path, message in buffer format
    const signature = await liskLedger.signMessage(ledgerAccount.derivePath(), Buffer.from(data.message, 'hex'));
    await transport.close();
    return signature;
  } catch (error) {
    if (transport) await transport.close();
    throw new Error(error);
  }
};

export default {
  checkLiskAppStatus,
  getAddress,
  getPublicKey,
  listener,
  signTransaction,
  signMessage,
};
