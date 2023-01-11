import { transactions } from '@liskhq/lisk-client';

export const ZERO_FEE = BigInt(0);

export const computeFee = (transaction, paramsSchema, auth, priorities, isTxValid, extraFee = BigInt(0)) => {
  if (!isTxValid) return ZERO_FEE;

  const selectedPriority = priorities.find(item => item.selected);
  const transactionSize = transactions.getBytes(transaction, paramsSchema).length;

  const allocateEmptySignaturesWithEmptyBuffer = (signatureCount) =>
    new Array(signatureCount).fill(Buffer.alloc(64));

  const numberOfSignatures = auth.numberOfSignatures || 1;

  const numberOfEmptySignatures = 0;

  const minFee = transactions.computeMinFee(
    {
      ...transaction,
      params: {
        ...transaction.params,
        ...(!transaction.params.signatures?.length && {
          signatures: allocateEmptySignaturesWithEmptyBuffer(numberOfSignatures),
        }),
      },
    },
    paramsSchema,
    {
      numberOfSignatures,
      numberOfEmptySignatures,
    }
  );

  return minFee + BigInt(selectedPriority.value * transactionSize) + extraFee;
}
