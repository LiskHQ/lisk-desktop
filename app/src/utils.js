import { ipcMain } from 'electron'; // eslint-disable-line import/no-extraneous-dependencies
import Lisk from 'lisk-elements'; // eslint-disable-line import/no-extraneous-dependencies

export const createCommand = (k, fn) => {
  ipcMain.on(`${k}.request`, (event, ...args) => {
    fn(...args)
      .then(r => ({ success: true, data: r }))
      .catch(e => ({ success: false, errorKey: e }))
      .then(r => event.sender.send(`${k}.result`, r));
  });
};

export const isValidAddress = address => address.length > 2 && address.length < 22 && address[address.length - 1] === 'L';

export const getBufferToHex = buffer => Lisk.cryptography.bufferToHex(buffer);

// eslint-disable-next-line max-len
export const getTransactionBytes = transaction => Lisk.transaction.utils.getTransactionBytes(transaction);
