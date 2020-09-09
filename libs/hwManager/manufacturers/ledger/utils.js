import Lisk from '@liskhq/lisk-client';// eslint-disable-line

export const getTransactionBytes = transaction =>
  Lisk.transaction.utils.getTransactionBytes(transaction);

export const getBufferToHex = buffer => Lisk.cryptography.bufferToHex(buffer);
