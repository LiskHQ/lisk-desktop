import { cryptography } from '@liskhq/lisk-client';
import { signMessageByHW } from './hwManager';

export const signMessageUsingHW = async ({ message, account }) => {
  const signature = await signMessageByHW({
    account,
    message,
  });

  const result = cryptography.ed.printSignedMessage({
    message,
    signature,
    publicKey: account.metadata.pubkey,
  });
  return result;
};
