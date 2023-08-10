import { to } from 'await-to-js';
import { cryptography } from '@liskhq/lisk-client';
import { signMessageUsingHW } from '@wallet/utils/signMessage';
import { signMessageWithPrivateKey } from '../utils/signMessageWithPrivateKey';

export const signMessage =
  ({ nextStep, message, privateKey, currentAccount }) =>
  async () => {
    if (currentAccount?.hw) {
      const [error, signature] = await to(signMessageUsingHW({ message, account: currentAccount }));
      const result = cryptography.ed.printSignedMessage({
        message,
        signature,
        publicKey: currentAccount.metadata.pubkey,
      });

      nextStep({ signature: result, error, message });
    } else {
      const signature = signMessageWithPrivateKey({
        message,
        privateKey,
      });

      nextStep({ signature, message });
    }
  };
