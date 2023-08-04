import { cryptography } from '@liskhq/lisk-client';
import { signMessageByHW } from './hwManager';

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
