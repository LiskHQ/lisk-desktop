import { cryptography } from '@liskhq/lisk-client';
import { signMessageByHW } from '@wallet/utilities/hwManager';// eslint-disable-line

/**
 * Signs a string with the users private key
 * @param {string} message - string value to be signed
 * @param {Object} account - Account of the user 
 * @returns {string} result - A signed value of the message
 */
export const signUsingPrivateKey = ({ message, account }) => {
  const msgBytes = cryptography.digestMessage(message);
  const signedMessage = cryptography.signDataWithPrivateKey(msgBytes, Buffer.from(account.summary.privateKey, 'hex'));
  const result = cryptography.printSignedMessage({
    message,
    publicKey: account.summary.publicKey,
    signature: signedMessage,
  });
  return result;
};

/**
 * Signs a string using hardware wallet
 * @param {string} message - string value to be signed
 * @param {Object} account - Account of the user 
 * @returns {string} result - A signed value of the message
 */
export const signUsingHW = async ({ message, account }) => {
  let signedMessage = await signMessageByHW({
    account,
    message,
  });
  if (signedMessage instanceof Uint8Array) {
    signedMessage = Buffer.from(signedMessage);
  }
  const result = cryptography.printSignedMessage({
    message,
    publicKey: account.summary.publicKey,
    signature: signedMessage,
  });
  return result;
};
