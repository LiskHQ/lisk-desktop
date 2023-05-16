import { transactions } from '@liskhq/lisk-client';
import { getSignedTransaction } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';
import { updateTransactionSignatures } from 'src/modules/wallet/utils/hwManager';
import { joinModuleAndCommand } from '../moduleCommand';
import { MODULE_COMMANDS_NAME_MAP } from '../../configuration/moduleCommand';

const createUnsignedMessage = (TAG, chainID, unsignedBytes) =>
  Buffer.concat([Buffer.from(TAG, 'utf8'), Buffer.from(chainID, 'hex'), unsignedBytes]).toString(
    'hex'
  );

/**
 * signTransactionByHW - Function.
 * This function is used for sign a send hardware wallet transaction.
 */
const signTransactionByHW = async ({ wallet, schema, chainID, transaction, senderAccount }) => {
  const unsignedBytes = transactions.getSigningBytes(transaction, schema);
  const unsignedMessage = createUnsignedMessage(
    transactions.TAG_TRANSACTION,
    chainID,
    unsignedBytes
  );
  const { signature } = await getSignedTransaction(
    wallet.hw.path,
    wallet.metadata.accountIndex,
    unsignedMessage
  );

  const isMultisigReg = joinModuleAndCommand(transaction) === MODULE_COMMANDS_NAME_MAP.registerMultisignature;
  const signerPublicKey = Buffer.from(senderAccount.summary.publicKey, 'hex');
  const isSender =
    Buffer.isBuffer(transaction.senderPublicKey) &&
    signerPublicKey.equals(transaction.senderPublicKey);

  const isFullySigned = isMultisigReg && transactions.params.signatures.filter(
      (sig) => sig.compare(Buffer.alloc(64)) >= 0
    ).length;

  if (isSender && isMultisigReg && isFullySigned) {
    // TODO we need to sign registration transaction here with new interface
  }


  return updateTransactionSignatures(wallet, senderAccount, transaction, Buffer.from(signature));
};

export { signTransactionByHW, createUnsignedMessage };
