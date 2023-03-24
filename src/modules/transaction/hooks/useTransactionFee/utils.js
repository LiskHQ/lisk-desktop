import { transactions } from '@liskhq/lisk-client';
import { joinModuleAndCommand } from '@transaction/utils/moduleCommand';
import { fromTransactionJSON } from '../../utils/encoding';

/**
 * Computes the minimum fee for a provided transaction
 * @returns {bigint} the transaction fee
 */

export const computeTransactionMinFee = (
  transactionJSON,
  paramsSchema,
  numberOfSignatures,
  extraCommandFee
) => {
  const options = {
    numberOfSignatures,
    numberOfEmptySignatures: 0,
    additionalFee: BigInt(extraCommandFee),
  };

  let convertedTx = {};
  try {
    convertedTx = fromTransactionJSON(transactionJSON, paramsSchema);
  } catch (exp) {
    convertedTx = {};
  }

  return transactions.computeMinFee(convertedTx, paramsSchema, options);
};

export const getParamsSchema = (transaction, schemas) => {
  const moduleCommand = joinModuleAndCommand({
    module: transaction.module,
    command: transaction.command,
  });

  return schemas[moduleCommand];
};
