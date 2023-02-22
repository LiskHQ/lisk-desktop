import { transactions } from '@liskhq/lisk-client';
import { updateTransactionSignatures } from '@wallet/utils/hwManager';
import hwManager from '@hardwareWallet/manager/HWManager';
/**
 * signTransactionByHW - Function.
 * This function is used for sign a send hardware wallet transaction.
 */
const signTransactionByHW = async ({
  wallet,
  schema,
  chainID,
  transaction,
}) => {
  const transactionBytes = transactions.getSigningBytes(transaction, schema);

  try {
    const signature = await hwManager.signTransaction(
      wallet.hwInfo.derivationIndex,
      chainID,
      transactionBytes,
    );
    return updateTransactionSignatures(wallet, transaction, signature);
  } catch (error) {
    throw new Error(error);
  }
};

export { signTransactionByHW };
