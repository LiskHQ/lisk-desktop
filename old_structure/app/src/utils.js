import { ipcMain } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import { cryptography, transactions } from '@liskhq/lisk-client'; // eslint-disable-line

export const createCommand = (command, fn) => {
  ipcMain.on(`${command}.request`, (event, ...args) => {
    fn(...args)
      .then(result => ({ success: true, data: result }))
      .catch(error => ({ success: false, errorKey: error }))
      .then(result => event.sender.send(`${command}.result`, result));
  });
};

export const isValidAddress = address => address.length > 2 && address.length < 22 && address[address.length - 1] === 'L';

export const getBufferToHex = buffer => cryptography.bufferToHex(buffer);

export const getTransactionBytes = transaction =>
  transaction.getBytes(transaction);
