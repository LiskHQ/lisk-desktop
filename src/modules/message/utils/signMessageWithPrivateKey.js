import { cryptography } from '@liskhq/lisk-client';

export const signMessageWithPrivateKey = ({ message, privateKey }) => {
  const result = cryptography.ed.signAndPrintMessage(message, Buffer.from(privateKey, 'hex'));

  return result;
};
