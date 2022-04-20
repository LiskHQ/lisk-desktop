import { cryptography } from '@liskhq/lisk-client';
import { signMessageByHW } from '@wallet/utilities/hwManager';// eslint-disable-line

/**
 * Signs a string with the users private key
 * @param {Object} signData - consists of the message and account information
 * @param {string} signData.message - A signed value of the message
 * @param {Object} signData.account - Account of the signed in user
 * @return {string} a signed value of the message
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
 * @param {Object} signData - consists of the message and account information
 * @param {string} signData.message - A signed value of the message
 * @param {Object} signData.account - Account of the signed in user
 * @return {string} a signed value of the message
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
