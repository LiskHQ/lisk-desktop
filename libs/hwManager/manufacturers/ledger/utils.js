import liskClient from 'Utils/lisk-client'; // eslint-disable-line


export const getTransactionBytes = (transaction) => {
  const Lisk = liskClient();
  return Lisk.transaction.utils.getTransactionBytes(transaction);
};

export const getBufferToHex = (buffer) => {
  const Lisk = liskClient();
  return Lisk.cryptography.bufferToHex(buffer);
};
