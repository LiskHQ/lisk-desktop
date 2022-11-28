import { signUsingPrivateKey } from 'src/modules/wallet/utils/signMessage';

export const signMessage =
  ({ nextStep, message, publicKey, privateKey, chainID }) =>
  async () => {
    nextStep({
      signature: signUsingPrivateKey({
        message,
        chainID,
        account: { summary: { publicKey, privateKey } },
      }),
      message,
    });
  };
