import { to } from 'await-to-js';
import { cryptography } from '@liskhq/lisk-client';
import { signMessageUsingHW } from '@wallet/utils/signMessage';
import {
  signMessageWithPrivateKey,
  signClaimMessageWithPrivateKey,
} from '../utils/signMessageWithPrivateKey';

export const getUnsignedNonProtocolMessage = (message) =>
  Buffer.concat([
    Buffer.from(cryptography.constants.MESSAGE_TAG_NON_PROTOCOL_MESSAGE, 'utf8'),
    Buffer.from(message, 'utf8'),
  ]).toString('hex');

export const signMessage =
  ({ nextStep, message, privateKey, currentAccount }) =>
  async () => {
    if (currentAccount?.hw) {
      const [error, signature] = await to(
        signMessageUsingHW({
          account: currentAccount,
          message: getUnsignedNonProtocolMessage(message),
        })
      );

      if (error) {
        return nextStep({ error, message });
      }

      const result = cryptography.ed.printSignedMessage({
        message,
        signature,
        publicKey: currentAccount.metadata.pubkey,
      });

      return nextStep({ signature: result, message });
    }
    const signature = signMessageWithPrivateKey({
      message,
      privateKey,
    });

    return nextStep({ signature, message });
  };

export const signClaimMessage =
  ({ nextStep, portalMessage, privateKey, currentAccount }) =>
  async () => {
    const signature = signClaimMessageWithPrivateKey({
      message: portalMessage,
      privateKey,
    });
    const portalSignature = {
      data: {
        pubKey: currentAccount.metadata.pubkey,
        r: `0x${signature.substring(0, 64)}`,
        s: `0x${signature.substring(64)}`,
      },
    };

    return nextStep({ signature: portalSignature, portalMessage });
  };
