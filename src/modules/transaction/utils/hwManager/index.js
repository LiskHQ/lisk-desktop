import { transactions } from '@liskhq/lisk-client';
import { getSignedTransaction } from '@libs/ledgerHardwareWallet/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';

const createMessage = (TAG, chainID, unsignedBytes) =>
  Buffer.concat([Buffer.from(TAG, 'utf8'), Buffer.from(chainID, 'hex'), unsignedBytes]).toString(
    'hex'
  );

/**
 * signTransactionByHW - Function.
 * This function is used for sign a send hardware wallet transaction.
 */
const signTransactionByHW = async ({ wallet, schema, chainID, transaction }) => {
  const unsignedBytes = transactions.getSigningBytes(transaction, schema);
  const unsignedMessage = createMessage(transactions.TAG_TRANSACTION, chainID, unsignedBytes);

  try {
    const signature = await getSignedTransaction(
      wallet.metadata.path,
      wallet.metadata.accountIndex,
      unsignedMessage,
    );
    transaction.signatures.push(signature.signature);
    return transaction;
    // return updateTransactionSignatures(wallet, transaction, signature);
  } catch (error) {
    throw new Error(error);
  }
};

export { signTransactionByHW };
