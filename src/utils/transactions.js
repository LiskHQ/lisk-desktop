import Lisk from '@liskhq/lisk-client';

import { byteSizes } from '../constants/transactionTypes';

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
  // not affect the fee calculation
  delete transaction.fee;

  const transactionType = Buffer.alloc(byteSizes.type, type);
  const transactionNonce = Lisk.cryptography.intToBuffer(
    Number(transaction.nonce),
    byteSizes.nonce,
  );
  const transactionSenderPublicKey = Lisk.cryptography.hexToBuffer(transaction.senderPublicKey);
  const txAsset = {
    amount: transaction.amount,
    data: transaction.data,
    recipientId: transaction.recipientId,
  };

  const assetBytes = Buffer.from(JSON.stringify(txAsset), 'utf-8');
  const feeBytes = Lisk.cryptography.intToBuffer(String(byteSizes.fee), byteSizes.fee);

  const totalBytes = Buffer.concat([
    transactionType,
    transactionNonce,
    transactionSenderPublicKey,
    assetBytes,
    feeBytes,
  ]).byteLength;

  return totalBytes + byteSizes.signature;
};

const dedupeTransactions = (pendingTransactions, confirmedTransactions) =>
  [...pendingTransactions, ...confirmedTransactions]
    .filter((transactionA, index, self) =>
      index === self.findIndex(transactionB => (
        transactionB.id === transactionA.id
      )));

export default dedupeTransactions;
