import { cryptography } from '@liskhq/lisk-client';
import { signMessageByHW } from './hwManager';

/**
 * Signs a string using hardware wallet
 * @param {Object} signData - consists of the message and account information
 * @param {string} signData.message - A signed value of the message
 * @param {Object} signData.account - Account of the signed in user
 * @return {string} a signed value of the message
 */
export const signMessageUsingHW = async ({ message, account }) => {
  let signature = await signMessageByHW({
    account,
    message,
  });
  if (signature instanceof Uint8Array) {
    signature = Buffer.from(signature);
  }
  const result = cryptography.ed.printSignedMessage({
    message,
    signature,
    publicKey: account.metadata.pubkey,
  });
  return result;
};
