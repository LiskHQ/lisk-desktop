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
  // Transaction originating from multisignature account must pass non empty signature count
  // So that transactions.computeMinFee can take into account future signatures bytes
  // Once the originator creates the transaction, none of the properties will be able to modify
  // If modified the integrity will be gone, hence accounting for future signatures bytes
  const getNumberOfEmptySignatures = () => {
    if (numberOfSignatures === 0) {
      return 0;
    }

    const nonEmptySignature = transactionJSON.signatures.filter((s) => s.length > 0);
    return numberOfSignatures - nonEmptySignature.length;
  };

  const options = {
    numberOfSignatures,
    numberOfEmptySignatures: getNumberOfEmptySignatures(),
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
