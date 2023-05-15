import { REQUEST, RESPONSE } from '@libs/hardwareWallet/ledger/constants';
import { errorCodeToString } from '@zondax/ledger-lisk/dist/common';
import { txStatusTypes } from '@transaction/configuration/txStatus';

const IPC = window.ipc;

class IPCLedgerError extends Error {
  constructor({ message, hwTxStatusType }) {
    super(message);
    this.message = message;
    this.hwTxStatusType = hwTxStatusType;
    this.stack = new Error(message).stack;
    this.name = 'IPCLedgerError';
  }
}

const getErrorMessage = (code) => {
  const errors = {
    65535: 'Device is disconnected',
    28161: 'Lisk app is not open',
    27014: 'Transaction rejected',
  };
  return errors[code] || errorCodeToString(code);
};

const getHWTxStatusType = (code) => {
  const hwTxStatusTypes = {
    65535: txStatusTypes.hwDisconnected,
    28161: txStatusTypes.hwLiskAppClosed,
    27014: txStatusTypes.hwRejected,
  };
  return hwTxStatusTypes[code];
};

export const executeIPCCommand = (action, data) =>
  new Promise((resolve, reject) => {
    // Listening for response
    IPC.once(`${action}.${RESPONSE}`, (_event, response) => {
      if (response.success) return resolve(response.data);
      const errorCode = response.error;
      return reject(
        new IPCLedgerError({
          message: getErrorMessage(errorCode),
          hwTxStatusType: getHWTxStatusType(errorCode),
        })
      );
    });
    // Requesting data
    IPC.send(`${action}.${REQUEST}`, data);
  });
