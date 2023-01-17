import { transactions } from '@liskhq/lisk-client';
import { joinModuleAndCommand } from '@transaction/utils/moduleCommand';

export const ZERO_FEE = BigInt(0);

/**
 * This is solution uses the same logic as implemented in transactions utility.
 * We'll replace this easily with said class methods.
 *
 * @param {object} transaction transaction object in JSON format
 * @param {object} paramsSchema transaction schema as retrieved from Service
 * @param {object} auth the auth WS response data
 * @param {array} priorities list of objects with value (number) and title (string), and selected (boolean)
 * @param {boolean} isTxValid defines if the form was validated successfully
 * @param {bigint} extraFee
 *
 * @returns {bigint} the transaction fee in Beddows
 */
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
};

export const getParamsSchema = (transaction, schemas) => {
  const moduleCommand = joinModuleAndCommand({
    module: transaction.module,
    command: transaction.command,
  });

  return schemas[moduleCommand];
};
