import { cryptography, transactions  } from '@liskhq/lisk-client';// eslint-disable-line

export const getTransactionBytes = transaction =>
  transactions.getBytes(transaction);

export const getBufferToHex = buffer => cryptography.bufferToHex(buffer);
