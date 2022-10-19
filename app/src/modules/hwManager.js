/* istanbul ignore file */
import { ipcMain } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'; // eslint-disable-line import/no-extraneous-dependencies
import { DeviceList } from 'trezor.js';
import { HwManager } from '../../../libs/hwManager';
import win from './win';

export const hwM = new HwManager({
  transports: {
    Ledger: TransportNodeHid,
    Trezor: new DeviceList(),
  },
  pubSub: {
    sender: win,
    receiver: ipcMain,
  },
});
