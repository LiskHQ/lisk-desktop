import { cryptography } from '@liskhq/lisk-client';
import { sign } from 'tweetnacl';

export const signMessageWithPrivateKey = ({ message, privateKey }) => {
  const result = cryptography.ed.signAndPrintMessage(message, Buffer.from(privateKey, 'hex'));

  return result;
};

export const signClaimMessageWithPrivateKey = ({ message, privateKey }) => {
  const result = Buffer.from(
    sign.detached(Buffer.from(message.substring(2), 'hex'), Buffer.from(privateKey, 'hex'))
  ).toString('hex');

  return result;
};
