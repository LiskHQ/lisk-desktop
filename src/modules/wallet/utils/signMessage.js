import i18next from 'i18next';
import { getSignedMessage } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';

export const signMessageUsingHW = async ({ account, message }) => {
  try {
    const signedMessage = await getSignedMessage(
      account.hw.path,
      account.metadata.accountIndex,
      message
    );
    let signature = signedMessage?.signature;

    if (!signature) {
      throw new Error(
        i18next.t('The message signature has been canceled on your {{model}}', {
          model: account.hw.product,
        })
      );
    }

    if (signature instanceof Uint8Array) {
      signature = Buffer.from(signature);
    }

    return signature;
  } catch (error) {
    throw new Error(
      i18next.t('The message signature has been canceled on your {{model}}', {
        model: account.hw.product,
      })
    );
  }
};
