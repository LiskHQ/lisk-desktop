import { transactions } from '@liskhq/lisk-client';
import { joinModuleAndCommand } from '@transaction/utils/moduleCommand';
import { fromTransactionJSON } from '../../utils/encoding';

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
export const computeTransactionMinFee = (
  transactionJSON,
  paramsSchema,
  auth,
) => {
  // @todo define the numberOfEmptySignatures based on the auth and number
  // of existing signatures in the transaction

  const options = {
    numberOfSignatures: auth.numberOfSignatures || 1,
    numberOfEmptySignatures: 0,
  };
  const minFee = transactions.computeMinFee(
    fromTransactionJSON(transactionJSON, paramsSchema),
    paramsSchema,
    options,
  );

  return minFee;
};

export const getParamsSchema = (transaction, schemas) => {
  const moduleCommand = joinModuleAndCommand({
    module: transaction.module,
    command: transaction.command,
  });

  return schemas[moduleCommand];
};
