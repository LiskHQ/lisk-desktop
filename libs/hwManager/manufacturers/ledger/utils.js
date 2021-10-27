import { cryptography, transactions } from '@liskhq/lisk-client';

export const getTransactionBytes = transaction =>
  transactions.getBytes(transaction);

export const convertBufferToHex = buffer => cryptography.bufferToHex(buffer);
