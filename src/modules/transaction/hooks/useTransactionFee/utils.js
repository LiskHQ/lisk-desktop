import { transactions } from '@liskhq/lisk-client';
import { joinModuleAndCommand } from '@transaction/utils/moduleCommand';
import { fromTransactionJSON } from '../../utils/encoding';

/**
 * This is solution uses the same logic as implemented in transactions utility.
 * We'll replace this easily with said class methods.
 *
 * @param {object} transaction transaction object in JSON format
 * @param {object} paramsSchema transaction schema as retrieved from Service
 * @param {int} numberOfSignatures number of signatures on the sender account
 * @param {array} priorities list of objects with value (number) and title (string), and selected (boolean)
 * @param {boolean} isTxValid defines if the form was validated successfully
 * @param {bigint} extraFee
 *
 * @returns {bigint} the transaction fee in Beddows
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
