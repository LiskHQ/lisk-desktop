import { app, ipcMain } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import Lisk from 'lisk-elements'; // eslint-disable-line import/no-extraneous-dependencies
import { LedgerAccount, SupportedCoin, DposLedger } from 'dpos-ledger-api'; // eslint-disable-line import/no-extraneous-dependencies
import win from './modules/win';


// eslint-disable-next-line import/no-extraneous-dependencies
// TransportNodeHid = require('@ledgerhq/hw-transport-node-hid');
// mock transportnodehid, todo fix this to work also on windows and linux
const TransportNodeHid = {
  open: () => {},
  listen: () => {},
  setListenDevicesDebounce: () => {},
  setListenDevicesPollingSkip: () => {},
};
TransportNodeHid.setListenDevicesDebounce(200);
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

const isValidAddress = address => address.length > 2 && address.length < 22 && address[address.length - 1] === 'L';
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
const ledgerObserver = {
  next: async ({ device, type }) => {
    if (device) {
      if (type === 'add') {
        if (process.platform === 'darwin' || await isInsideLedgerApp(device.path)) {
          ledgerPath = device.path;
          win.send({ event: 'ledgerConnected', value: null });
        }
      } else if (type === 'remove') {
        if (ledgerPath) {
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
const createCommand = (k, fn) => {
  ipcMain.on(`${k}.request`, (event, ...args) => {
    fn(...args)
      .then(r => ({ success: true, data: r }))
      .catch(e => ({ success: false, errorKey: e }))
      .then(r => event.sender.send(`${k}.result`, r));
  });
};
// eslint-disable-next-line arrow-body-style
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
