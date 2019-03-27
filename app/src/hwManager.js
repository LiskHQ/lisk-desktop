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

const connectedDevices = [];

createCommand('getConnectedDevicesList', () => Promise.resolve(connectedDevices));

export const addConnectedDevices = (device) => {
  logDebug('Adding device', device);
  connectedDevices.push(device);
  win.send({ event: 'hwDeviceListChanged', value: connectedDevices });
};

export const removeConnectedDeviceByID = (deviceId) => {
  connectedDevices.some((device, index) =>
    ((connectedDevices[index].deviceId === deviceId) ?
      !!(connectedDevices.splice(index, 1)) : false));
  win.send({ event: 'hwDeviceListChanged', value: connectedDevices });
};

export const removeConnectedDeviceByPath = (path) => {
  logDebug('Removing device with path: ', path);
  connectedDevices.some((device, index) =>
    ((connectedDevices[index].path === path) ?
      !!(connectedDevices.splice(index, 1)) : false));
  win.send({ event: 'hwDeviceListChanged', value: connectedDevices });
};

export const getDeviceById = deviceId =>
  connectedDevices[connectedDevices.findIndex(x => x.deviceId === deviceId)];

export const getDeviceByPath = path =>
  connectedDevices[connectedDevices.findIndex(x => x.path === path)];

// eslint-disable-next-line arrow-body-style
createCommand('hwCommand', (command) => {
  logDebug('Hardware Wallet Command Received: ', command);
  const device = getDeviceById(command.data.deviceId);
  if (device) {
    logDebug('Command Will be executed with device: ', device);
    if (device.model === 'Ledger Nano S') {
      return executeLedgerCommand(device, command);
    }
    return executeTrezorCommand(device, command);
  }
  logDebug('No device found with deviceId: ', command.data.deviceId);
  return Promise.reject('ERROR_OR_DEVICE_IS_NOT_CONNECTED');
});
