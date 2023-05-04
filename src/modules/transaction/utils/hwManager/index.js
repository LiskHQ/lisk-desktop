import { transactions } from '@liskhq/lisk-client';
import { getSignedTransaction } from '@libs/hardwareWallet/ledger/ledgerLiskAppIPCChannel/clientLedgerHWCommunication';

const createUnsignedMessage = (TAG, chainID, unsignedBytes) =>
  Buffer.concat([Buffer.from(TAG, 'utf8'), Buffer.from(chainID, 'hex'), unsignedBytes]).toString(
    'hex'
  );

/**
 * signTransactionByHW - Function.
 * This function is used for sign a send hardware wallet transaction.
 */
const signTransactionByHW = async ({ wallet, schema, chainID, transaction }) => {
  const unsignedBytes = transactions.getSigningBytes(transaction, schema);
  const unsignedMessage = createUnsignedMessage(
    transactions.TAG_TRANSACTION,
    chainID,
    unsignedBytes
  );

  try {
    const signature = await getSignedTransaction(
      wallet.hw.path,
      wallet.metadata.accountIndex,
      unsignedMessage
    );
    transaction.signatures.push(signature.signature);
    return transaction;
    // return updateTransactionSignatures(wallet, transaction, signature);
  } catch (error) {
    throw new Error(error);
  }
};

export { signTransactionByHW, createUnsignedMessage };
