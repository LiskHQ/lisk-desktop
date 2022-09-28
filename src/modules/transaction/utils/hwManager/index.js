import { updateTransactionSignatures } from '@wallet/utils/hwManager';
import { signTransaction } from '@libs/hwManager/communication';
/**
 * signTransactionByHW - Function.
 * This function is used for sign a send hardware wallet transaction.
 */
const signTransactionByHW = async (
  wallet,
  chainID,
  transaction,
  transactionBytes,
) => {
  const data = {
    deviceId: wallet.hwInfo.deviceId,
    index: wallet.hwInfo.derivationIndex,
    chainID,
    transactionBytes,
  };

  try {
    const signature = await signTransaction(data);
    return updateTransactionSignatures(wallet, transaction, signature);
  } catch (error) {
    throw new Error(error);
  }
};

// eslint-disable-next-line import/prefer-default-export
export { signTransactionByHW };
