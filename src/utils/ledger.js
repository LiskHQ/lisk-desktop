import 'babel-polyfill';
import { isBrowser } from 'browser-or-node';
import isElectron from 'is-electron';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import i18next from 'i18next';
import { LedgerAccount, SupportedCoin, DposLedger } from 'dpos-ledger-api';
import { hwConstants, LEDGER_COMMANDS } from '../constants/hwConstants';
// import { loadingStarted, loadingFinished } from './loading';
// import signPrefix from '../constants/signPrefix';
import { infoToastDisplayed, errorToastDisplayed } from '../actions/toaster';
import { calculateTxId, getBufferToHex, getTransactionBytes } from './rawTransactionWrapper';
import store from '../store';
 export const LEDGER_MSG = {
  LEDGER_NO_TRANSPORT_AVAILABLE: i18next.t('Unable to detect the communication layer with your Ledger Nano S'),
  LEDGER_NO_TRANSPORT_AVAILABLE_U2F: i18next.t('Unable to detect the communication layer. Is ledger connected? Is Fido U2F Extension Installed?'),
  LEDGER_IS_NOT_CONNECTED: i18next.t('Unable to detect your Ledger Nano S. Be sure your device is connected and inside the Lisk App'),
  LEDGER_ERR_DURING_CONNECTION: i18next.t('Error on Ledger Connection. Be sure your device is connected properly'),
  LEDGER_CONNECTED: i18next.t('Ledger Nano S Connected.'),
  LEDGER_DISCONNECTED: i18next.t('Ledger Nano S Disconnected.'),
  LEDGER_ACTION_DENIED_BY_USER: i18next.t('Action Denied by User'),
  LEDGER_ASK_FOR_CONFIRMATION: i18next.t('Look at your Ledger for confirmation'),
  LEDGER_ASK_FOR_CONFIRMATION_PIN: i18next.t('Look at your Ledger for confirmation of second signature'),
};
 const { ipc } = window;
 if (ipc) { // On browser-mode is undefined
  ipc.on('ledgerConnected', () => {
    console.log('CONNECTED');
    store.dispatch(infoToastDisplayed({ label: LEDGER_MSG.LEDGER_CONNECTED }));
  });
   ipc.on('ledgerDisconnected', () => {
    store.dispatch(errorToastDisplayed({ label: LEDGER_MSG.LEDGER_DISCONNECTED }));
  });
}
 const getLedgerTransportU2F = async () => TransportU2F.create();
 export const getLedgerAccount = (index = 0) => {

  const ledgerAccount = new LedgerAccount();
  console.log('TUTUTUUT', ledgerAccount);

  ledgerAccount.coinIndex(SupportedCoin.LISK);
  ledgerAccount.account(index);
  return ledgerAccount;
};
 export const calculateSecondPassphraseIndex =
  (accountIndex, pin) => accountIndex + parseInt(pin, 10) + hwConstants.secondPassphraseOffset;
 const sendIpcCommand = command =>
  new Promise((resolve, reject) => {
    ipc.once('ledgerCommand.result', (event, res) => {
      if (res.success) {
        return resolve(res.data);
      }
      return reject(new Error(LEDGER_MSG[res.errorKey]));
    });
    ipc.send('ledgerCommand.request', command);
  });
 const ledgerPlatformHendler = async (command) => {
  if (isElectron()) {
    return sendIpcCommand(command);
  }
  console.log('ledgerPlatformHendler');
   if (isBrowser) {
    let transport = null;
    try {
      transport = await getLedgerTransportU2F();
    } catch (e) {
      console.log(e);
      throw new Error(LEDGER_MSG.LEDGER_NO_TRANSPORT_AVAILABLE_U2F);
    }
    console.log('transport', transport);
     try {
      const liskLedger = new DposLedger(transport);
      const ledgerAccount = getLedgerAccount(command.data.index);
      let commandResult;
      console.log('action', command.action)

      if (command.action === LEDGER_COMMANDS.GET_ACCOUNT) {
        commandResult = await liskLedger.getPubKey(ledgerAccount);
      }
      if (command.action === LEDGER_COMMANDS.SIGN_MSG) {
        const signature = await liskLedger.signMSG(ledgerAccount, command.data.message);
        commandResult = getBufferToHex(signature.slice(0, 64));
      }
      if (command.action === LEDGER_COMMANDS.SIGN_TX) {
        commandResult = await liskLedger.signTX(ledgerAccount, command.data.tx, false);
      }
      console.log('commandResult', commandResult);
       transport.close();
       console.log('transport', transport);

      return commandResult;
    } catch (err) {
      if (err.statusText && err.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
        throw new Error(LEDGER_MSG.LEDGER_ACTION_DENIED_BY_USER);
      } else {
        throw new Error(LEDGER_MSG.LEDGER_IS_NOT_CONNECTED);
      }
    }
  }
   throw new Error(LEDGER_MSG.LEDGER_NO_TRANSPORT_AVAILABLE);
};
 export const getAccountFromLedgerIndex = (index = 0) => {
  const command = {
    action: LEDGER_COMMANDS.GET_ACCOUNT,
    data: { index },
  };
  return ledgerPlatformHendler(command);
};
//  export const signMessageWithLedger = async (account, message) => {
//   const command = {
//     action: LEDGER_COMMANDS.SIGN_MSG,
//     data: {
//       index: account.hwInfo.derivationIndex,
//       message: signPrefix + message,
//     },
//   };
//    store.dispatch(infoToastDisplayed({ label: LEDGER_MSG.LEDGER_ASK_FOR_CONFIRMATION_PIN }));
//    return ledgerPlatformHendler(command);
// };
 /* eslint-disable prefer-const */
// export const signTransactionWithLedger = async (tx, account, pin) => {
//   const command = {
//     action: LEDGER_COMMANDS.SIGN_TX,
//     data: {
//       index: account.hwInfo.derivationIndex,
//       tx: getTransactionBytes(tx),
//     },
//   };
//    loadingStarted('ledgerUserAction');
//   store.dispatch(infoToastDisplayed({ label: LEDGER_MSG.LEDGER_ASK_FOR_CONFIRMATION }));
//    let signature;
//   try {
//     signature = await ledgerPlatformHendler(command);
//   } catch (err) {
//     loadingFinished('ledgerUserAction');
//     throw err;
//   }
//    tx.signature = getBufferToHex(signature);
//   loadingFinished('ledgerUserAction');
//    // In case of second signature (PIN)
//   if (typeof pin === 'string' && pin !== '') {
//     const command2 = {
//       action: LEDGER_COMMANDS.SIGN_TX,
//       data: {
//         index: calculateSecondPassphraseIndex(account.hwInfo.derivationIndex, pin),
//         tx: getTransactionBytes(tx),
//       },
//     };
//      loadingStarted('ledgerUserAction');
//     store.dispatch(infoToastDisplayed({ label: LEDGER_MSG.LEDGER_ASK_FOR_CONFIRMATION_PIN }));
//      let signSignature;
//     try {
//       signSignature = await ledgerPlatformHendler(command2);
//     } catch (err) {
//       loadingFinished('ledgerUserAction');
//       throw err;
//     }
//      tx.signSignature = getBufferToHex(signSignature);
//     loadingFinished('ledgerUserAction');
//   }
//    tx.id = calculateTxId(tx);
//   return tx;
// };