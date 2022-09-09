import { updateTransactionSignatures } from '@wallet/utils/hwManager';
import { signTransaction } from '@libs/hwManager/communication';
/**
 * signTransactionByHW - Function.
 * This function is used for sign a send hardware wallet transaction.
 */
const signTransactionByHW = async (
  wallet,
  networkIdentifier,
  transactionObject,
  transactionBytes,
  keys
) => {
  const data = {
    deviceId: wallet.hwInfo.deviceId,
    index: wallet.hwInfo.derivationIndex,
    networkIdentifier,
    transactionBytes,
  };

  try {
    const signature = await signTransaction(data);
    return updateTransactionSignatures(wallet, transactionObject, signature, keys);
  } catch (error) {
    throw new Error(error);
  }
};

// eslint-disable-next-line import/prefer-default-export
export { signTransactionByHW };
