/**
 * signTransactionByHW - Function.
 * This function is used for sign a send hardware wallet transaction.
 */
const signTransactionByHW = async (
  account,
  networkIdentifier,
  transactionObject,
  transactionBytes,
  keys,
) => {
  const data = {
    deviceId: account.hwInfo.deviceId,
    index: account.hwInfo.derivationIndex,
    networkIdentifier,
    transactionBytes,
  };

  try {
    const signature = await signTransaction(data);
    return updateTransactionSignatures(account, transactionObject, signature, keys);
  } catch (error) {
    throw new Error(error);
  }
};

export {
  signTransactionByHW,
};