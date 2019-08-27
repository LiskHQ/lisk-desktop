import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import * as trezor from 'trezor.js';
import hwManager from './hwManager';

const test = async () => {
  hwManager.setTransport({ name: 'ledger', transport: TransportNodeHid });
  const list = new trezor.DeviceList({});
  console.log({ trezor });
  hwManager.listener();
  console.log({ devices: hwManager.devices });
  // console.log(await hwManager.getDevices());
};

test();
export default test;
