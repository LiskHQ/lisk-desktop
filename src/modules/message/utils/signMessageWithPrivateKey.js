import { cryptography } from '@liskhq/lisk-client';

/**
 * Signs a string with the users private key
 * @param {Object} signData - consists of the message and account information
 * @param {string} signData.message - A signed value of the message
 * @param {Object} signData.privateKey - Private key of the signed in user
 * @return {string} a signed value of the message
 */
export const signMessageWithPrivateKey = ({ message, privateKey }) => {
  const result = cryptography.ed.signAndPrintMessage(message, Buffer.from(privateKey, 'hex'));

  return result;
};
