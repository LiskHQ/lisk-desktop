import { app, ipcMain } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import Lisk from '@liskhq/lisk-client'; // eslint-disable-line import/no-extraneous-dependencies
import { LedgerAccount, SupportedCoin, DposLedger } from 'dpos-ledger-api'; // eslint-disable-line import/no-extraneous-dependencies
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'; // eslint-disable-line import/no-extraneous-dependencies

import {
  HWDevice,
  addConnectedDevices,
  removeConnectedDeviceByPath,
  getDeviceById,
  updateConnectedDevices,
} from './hwManager';

import { isValidAddress } from './utils';
import win from './modules/win';
import { getTransactionBytes } from '../../src/utils/rawTransactionWrapper';

// mock transportnodehid, todo fix this to work also on windows and linux
// const TransportNodeHid = {
//   open: () => {},
//   listen: () => {},
//   setListenDevicesDebounce: () => {},
//   setListenDevicesPollingSkip: () => {},
// };
// TransportNodeHid.setListenDevicesDebounce(200);
/*
TransportNodeHid.setListenDevicesDebug((msg, ...args) => {
  console.log(msg);
  console.log({
    type: 'listenDevices',
    args,
  });
});
*/
let busy = false;
TransportNodeHid.setListenDevicesPollingSkip(() => busy);
TransportNodeHid.setListenDevicesDebounce(0);
const getLedgerAccount = (index = 0) => {
  const ledgerAccount = new LedgerAccount();
  ledgerAccount.coinIndex(SupportedCoin.LISK);
  ledgerAccount.account(index);
  return ledgerAccount;
};

const createLedgerHWDevice = ({ path, model }) =>
  new HWDevice(
    Math.floor(Math.random() * 1e5) + 1,
    null,
    model,
    path,
  );

const getLiskAccount = async (path) => {
  let transport;
  try {
    transport = await TransportNodeHid.open(path);
    const liskLedger = new DposLedger(transport);
    const ledgerAccount = getLedgerAccount(0);
    const liskAccount = await liskLedger.getPubKey(ledgerAccount);
    transport.close();
    return liskAccount;
  } catch (e) {
    if (transport) transport.close();
    return null;
  }
};

const isInsideLedgerApp = async (path) => {
  const liskAccount = await getLiskAccount(path);
  if (liskAccount) return isValidAddress(liskAccount.address);
  return false;
};

let devices = [];
const clearDevices = async () => {
  const connectedPaths = await TransportNodeHid.list();
  devices
    .filter(device => !connectedPaths.includes(device.path))
    .forEach(device => removeConnectedDeviceByPath(device.path));

  devices = devices.filter(device => connectedPaths.includes(device.path));
};

const ledgerObserver = {
  // eslint-disable-next-line max-statements
  next: async ({ device, type }) => {
    clearDevices();
    if (device) {
      if (type === 'add') {
        const ledgerDevice = createLedgerHWDevice({
          path: device.path,
          model: `${device.manufacturer} ${device.product}`,
        });
        ledgerDevice.openApp = await isInsideLedgerApp(device.path);
        devices.push(device);
        addConnectedDevices(ledgerDevice);
        win.send({ event: 'hwConnected', value: { model: ledgerDevice.model } });
      } else if (type === 'remove') {
        if (device) {
          removeConnectedDeviceByPath(device.path);
          win.send({ event: 'hwDisconnected', value: { model: `${device.manufacturer} ${device.product}` } });
        }
      }
    }
  },
};

ipcMain.on('checkLedger', async (event, { id }) => {
  const ledgerDevice = getDeviceById(id);
  ledgerDevice.openApp = await isInsideLedgerApp(ledgerDevice.path);
  updateConnectedDevices(ledgerDevice);
  win.send({ event: 'checkLedger.done' });
});

let observableListen = null;
const syncDevices = () => {
  try {
    observableListen = TransportNodeHid.listen(ledgerObserver);
  } catch (e) {
    syncDevices();
  }
};
syncDevices();

app.on('will-quit', () => {
  if (observableListen) {
    observableListen.unsubscribe();
    observableListen = null;
  }
});

const getBufferToHex = buffer => Lisk.cryptography.bufferToHex(buffer);

/* eslint-disable prefer-promise-reject-errors */
// eslint-disable-next-line import/prefer-default-export
export const executeLedgerCommand = (device, command) =>
  TransportNodeHid.open(device.path)
    // eslint-disable-next-line max-statements
    .then(async (transport) => {
      busy = true;

      try {
        const liskLedger = new DposLedger(transport);
        const ledgerAccount = getLedgerAccount(command.data.index);
        let res;

        if (command.action === 'GET_PUBLICKEY') {
          res = await liskLedger.getPubKey(ledgerAccount, command.data.showOnDevice);
          res = res.publicKey;
        }
        if (command.action === 'GET_ADDRESS') {
          res = await liskLedger.getPubKey(ledgerAccount, command.data.showOnDevice);
          res = res.address;
        }
        if (command.action === 'SIGN_MSG') {
          win.send({ event: 'ledgerButtonCallback', value: null });
          const signature = await liskLedger.signMSG(ledgerAccount, command.data.message);
          res = getBufferToHex(signature.slice(0, 64));
        }
        if (command.action === 'SIGN_TX') {
          win.send({ event: 'ledgerButtonCallback', value: null });
          const signature = await liskLedger.signTX(
            ledgerAccount,
            getTransactionBytes(command.data.tx),
            false,
          );
          res = getBufferToHex(signature);
        }
        transport.close();
        busy = false;
        return Promise.resolve(res);
      } catch (err) {
        transport.close();
        busy = false;
        if (err.statusText && err.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
          return Promise.reject('LEDGER_ACTION_DENIED_BY_USER');
        }
        return Promise.reject('LEDGER_ERR_DURING_CONNECTION');
      }
    })
    .catch((e) => {
      if (typeof e === 'string') {
        return Promise.reject(e);
      }
      return Promise.reject('LEDGER_ERR_DURING_CONNECTION');
    });
