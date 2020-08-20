import Lisk from '@liskhq/lisk-client';

const BYTESIZES = {
  TYPE: 1,
  NONCE: 8,
  FEE: 8,
  SIGNATURE: 64,
};

/**
 * calculates the transaction size in bytes
 * @param {{type: number, transaction: Object}} param
 * @returns {number} the transaction size in bytes
 */
// eslint-disable-next-line max-statements
export const findTransactionSizeInBytes = ({
  type, transaction,
}) => {
  // delete the fee property from the transaction so it does
  // not affect the fee calcualtion
  delete transaction.fee;

  const transactionType = Buffer.alloc(BYTESIZES.TYPE, type);
  const transactionNonce = Lisk.cryptography.intToBuffer(
    Number(transaction.nonce),
    BYTESIZES.NONCE,
  );
  const transactionSenderPublicKey = Lisk.cryptography.hexToBuffer(transaction.senderPublicKey);
  const txAsset = {
    amount: transaction.amount,
    data: transaction.data,
    recipienetId: transaction.recipienetId,
  };

  const assetBytes = Buffer.from(JSON.stringify(txAsset), 'utf-8');
  const feeBytes = Lisk.cryptography.intToBuffer(String(BYTESIZES.FEE), BYTESIZES.FEE);

  const totalBytes = Buffer.concat([
    transactionType,
    transactionNonce,
    transactionSenderPublicKey,
    assetBytes,
    feeBytes,
  ]).byteLength;

  return totalBytes + BYTESIZES.SIGNATURE;
};

const dedupeTransactions = (pendingTransactions, confirmedTransactions) =>
  [...pendingTransactions, ...confirmedTransactions]
    .filter((transactionA, index, self) =>
      index === self.findIndex(transactionB => (
        transactionB.id === transactionA.id
      )));

export default dedupeTransactions;
