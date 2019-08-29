/* istanbul ignore file */
import { ipcMain } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'; // eslint-disable-line import/no-extraneous-dependencies
import { DeviceList } from 'trezor.js'; // eslint-disable-line import/no-extraneous-dependencies
import HwManager from '../../../libs/hwManager';
import win from './win';

const hwM = new HwManager({
  transports: {
    ledger: TransportNodeHid,
    trezor: new DeviceList(),
  },
  pubSub: {
    sender: win,
    receiver: ipcMain,
  },
});
hwM.init();
