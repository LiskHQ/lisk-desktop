import { app } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import Lisk from 'lisk-elements'; // eslint-disable-line import/no-extraneous-dependencies
import { LedgerAccount, SupportedCoin, DposLedger } from 'dpos-ledger-api'; // eslint-disable-line import/no-extraneous-dependencies
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid'; // eslint-disable-line import/no-extraneous-dependencies

import {
  HWDevice,
  addConnectedDevices,
  removeConnectedDeviceByPath,
} from './hwManager';

import { createCommand, isValidAddress } from './utils';
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
let ledgerPath = null;
const getLedgerAccount = (index = 0) => {
  const ledgerAccount = new LedgerAccount();
  ledgerAccount.coinIndex(SupportedCoin.LISK);
  ledgerAccount.account(index);
  return ledgerAccount;
};

const isInsideLedgerApp = async (path) => {
  try {
    const transport = await TransportNodeHid.open(path);
    const liskLedger = new DposLedger(transport);
    const ledgerAccount = getLedgerAccount(0);
    const liskAccount = await liskLedger.getPubKey(ledgerAccount);
    transport.close();
    return isValidAddress(liskAccount.address);
  } catch (e) {
    return false;
  }
};

const createLedgerHWDevice = (liskAccount, path) =>
  new HWDevice(
    liskAccount.publicKey.substring(0, 10),
    null,
    'Ledger Nano S',
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

const ledgerObserver = {
  // eslint-disable-next-line max-statements
  next: async ({ device, type }) => {
    if (device) {
      if (type === 'add') {
        if (process.platform !== 'linux' || await isInsideLedgerApp(device.path)) {
          const liskAccount = await getLiskAccount(device.path);
          const ledgerDevice = createLedgerHWDevice(liskAccount, device.path);
          addConnectedDevices(ledgerDevice);
          ledgerPath = device.path;
          win.send({ event: 'ledgerConnected', value: null });
        }
      } else if (type === 'remove') {
        if (ledgerPath) {
          removeConnectedDeviceByPath(ledgerPath);
          ledgerPath = null;
          win.send({ event: 'ledgerDisconnected', value: null });
        }
      }
    }
  },
};

let observableListen = null;
const syncDevices = () => {
  try {
    observableListen = TransportNodeHid.listen(ledgerObserver);
  } catch (e) {
    ledgerPath = null;
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

// // eslint-disable-next-line arrow-body-style
createCommand('ledgerCommand', (command) => {
  if (ledgerPath) {
    return TransportNodeHid.open(ledgerPath)
      .then(async (transport) => { // eslint-disable-line max-statements
        busy = true;
        try {
          const liskLedger = new DposLedger(transport);
          const ledgerAccount = getLedgerAccount(command.data.index);
          let commandResult;
          if (command.action === 'GET_ACCOUNT') {
            commandResult = await liskLedger.getPubKey(ledgerAccount);
          }
          if (command.action === 'SIGN_MSG') {
            const signature = await liskLedger.signMSG(ledgerAccount, command.data.message);
            commandResult = getBufferToHex(signature.slice(0, 64));
          }
          if (command.action === 'SIGN_TX') {
            commandResult = await liskLedger.signTX(ledgerAccount, command.data.tx, false);
          }
          transport.close();
          busy = false;
          return Promise.resolve(commandResult);
        } catch (err) {
          transport.close();
          busy = false;
          if (err.statusText && err.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
            return Promise.reject(new Error('LEDGER_ACTION_DENIED_BY_USER'));
          }
          return Promise.reject(new Error('LEDGER_ERR_DURING_CONNECTION'));
        }
      })
      .catch((e) => {
        if (typeof e === 'string') {
          return Promise.reject(e);
        }
        return Promise.reject(new Error('LEDGER_ERR_DURING_CONNECTION'));
      });
  }
  return Promise.reject(new Error('LEDGER_IS_NOT_CONNECTED'));
});
