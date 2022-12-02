import { signMessageWithPrivateKey } from '../utils/signMessageWithPrivateKey';

export const signMessage =
  ({ nextStep, message, privateKey }) =>
  async () => {
    const signature = signMessageWithPrivateKey({
      message,
      privateKey,
    });

    nextStep({ signature, message });
  };
