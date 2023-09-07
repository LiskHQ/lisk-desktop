import i18next from 'i18next';
import { getSignedMessage } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';
import { IPCLedgerError } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication/utils';
import { txStatusTypes } from '@transaction/configuration/txStatus';

export const signMessageUsingHW = async ({ account, message }) => {
  try {
    const signedMessage = await getSignedMessage(
      account.hw.path,
      account.metadata.accountIndex,
      message
    );
    let signature = signedMessage?.signature;

    if (!signature) {
      throw new IPCLedgerError({
        message: i18next.t('The message signature has been canceled on your {{model}}', {
          model: account.hw.product,
        }),
        hwTxStatusType: txStatusTypes.hwRejected,
      });
    }

    if (signature instanceof Uint8Array) {
      signature = Buffer.from(signature);
    }

    return signature;
  } catch (error) {
    throw new IPCLedgerError(error);
  }
};
