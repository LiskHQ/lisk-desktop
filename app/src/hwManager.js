/* eslint-disable */
/**
 * TODO - remove the logic of this file and use it in a external library/module
 * This file will be on charge of communicate the electron app with the HW module/library
 * this file should only containe a few functions.
 * 
 * Init - Function - For observ/subscribe or listen to changes.
 * getDevices - function - that retturn all connected devices.
 * signInTX - function - sign in any kind of tx 
 * getPublicKey - function - get public key for other users like getAccounts (if the public key is used for retrive other information then dont need this func)
 * getAccounts - function - retrive all accounts from device
 * ping - function - function that check device status
 * 
 * All of the above should be use for any HW device that will be implement in the future, right now
 * only Ledger Nano S, Ledger Nano X, Trezor Model T and Trezor One.
 **/

import win from './modules/win';
import { createCommand } from './utils';
import { executeLedgerCommand } from './ledger';
import { executeTrezorCommand } from './trezor';

// set to true to see messages
const debug = false;
const logDebug = (...args) => {
  if (debug) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

export class HWDevice {
  constructor(deviceId, label, model, path) {
    this.deviceId = deviceId;
    this.label = label;
    this.model = model;
    this.path = path; // Used only for Ledger Nano S
    this.pp = null;
  }
}

let connectedDevices = [];

createCommand('getConnectedDevicesList', () => Promise.resolve(connectedDevices));

export const addConnectedDevices = (device) => {
  logDebug('Adding device', device);
  connectedDevices.push(device);
  win.send({ event: 'hwDeviceListChanged', value: connectedDevices });
};

export const updateConnectedDevices = (device) => {
  logDebug('Updating device', device);
  const deviceIndex = connectedDevices.findIndex(d => d.path === device.path);
  connectedDevices[deviceIndex] = device;
  win.send({ event: 'hwDeviceListChanged', value: connectedDevices });
};

export const removeConnectedDeviceByID = (deviceId) => {
  logDebug('Removing device with id: ', deviceId);
  connectedDevices = connectedDevices.filter(d => d.deviceId !== deviceId);
  win.send({ event: 'hwDeviceListChanged', value: connectedDevices });
};

export const removeConnectedDeviceByPath = (path) => {
  logDebug('Removing device with path: ', path);
  connectedDevices = connectedDevices.filter(d => d.path !== path);
  win.send({ event: 'hwDeviceListChanged', value: connectedDevices });
};

export const getDeviceById = deviceId =>
  connectedDevices.find(device => device.deviceId === deviceId);

export const getDeviceByPath = path =>
  connectedDevices.find(device => device.path === path);

// eslint-disable-next-line arrow-body-style
createCommand('hwCommand', (command) => {
  logDebug('Hardware Wallet Command Received: ', command);
  const device = getDeviceById(command.data.deviceId);
  if (device) {
    logDebug('Command Will be executed with device: ', device);
    if (device.model.indexOf('Ledger') !== -1) {
      return executeLedgerCommand(device, command);
    }
    return executeTrezorCommand(device, command);
  }
  logDebug('No device found with deviceId: ', command.data.deviceId);
  return Promise.reject('ERROR_OR_DEVICE_IS_NOT_CONNECTED');
});
