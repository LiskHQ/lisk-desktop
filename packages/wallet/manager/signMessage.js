import { cryptography } from '@liskhq/lisk-client';
import { signMessageByHW } from '@wallet/utilities/hwManager';// eslint-disable-line

const useSignUsingPrivateKey = ({ message, account }) => {
  const msgBytes = cryptography.digestMessage(message);
  const signedMessage = cryptography.signDataWithPrivateKey(msgBytes, Buffer.from(account.summary.privateKey, 'hex'));
  const result = cryptography.printSignedMessage({
    message,
    publicKey: account.summary.publicKey,
    signature: signedMessage,
  });
  return result;
};

const signUsingHW = async ({ message, account }) => {
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

export default { useSignUsingPrivateKey, signUsingHW };
