import { transactions } from '@liskhq/lisk-client';
import { joinModuleAndCommand } from '@transaction/utils/moduleCommand';
import { DEFAULT_SIGNATURE_BYTE_SIZE } from '@transaction/configuration/transactions';

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
export const computeTransactionMinFee = (
  transaction,
  paramsSchema,
  auth,
  priorities,
  isTxValid,
) => {
  if (!isTxValid || !paramsSchema || !auth || !priorities?.length) return ZERO_FEE;

  const allocateEmptySignaturesWithEmptyBuffer = (signatureCount) =>
    new Array(signatureCount).fill(Buffer.alloc(DEFAULT_SIGNATURE_BYTE_SIZE));

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

  return minFee;
};

export const getParamsSchema = (transaction, schemas) => {
  const moduleCommand = joinModuleAndCommand({
    module: transaction.module,
    command: transaction.command,
  });

  return schemas[moduleCommand];
};
