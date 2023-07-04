/* eslint-disable max-lines */
import { transactions } from '@liskhq/lisk-client';
import {
  MIN_FEE_PER_BYTE,
  DEFAULT_NUMBER_OF_SIGNATURES,
} from '@transaction/configuration/transactions';
import {
  MODULE_COMMANDS_MAP,
  MODULE_COMMANDS_NAME_MAP,
} from 'src/modules/transaction/configuration/moduleCommand';
import { joinModuleAndCommand } from 'src/modules/transaction/utils/moduleCommand';
import { convertFromBaseDenom } from '@token/fungible/utils/helpers';
import http from 'src/utils/api/http';
import { httpPaths } from '../configuration';
import { sign } from '../utils';
import { fromTransactionJSON } from '../utils/encoding';

/**
 * Returns a dictionary of base fees for low, medium and high processing speeds
 * @returns {Promise<{Low: number, Medium: number, High: number}>} with low,
 * medium and high priority fee options
 */
export const getTransactionBaseFees = (network) =>
  http({
    path: httpPaths.fees,
    searchParams: {},
    network,
  }).then((response) => {
    const { feeEstimatePerByte } = response.data;

    return {
      Low: feeEstimatePerByte.low,
      Medium: feeEstimatePerByte.medium,
      High: feeEstimatePerByte.high,
    };
  });

/**
 * Returns the actual tx fee based on given tx details
 * and selected processing speed
 */
// eslint-disable-next-line max-statements
export const getTransactionFee = async ({
  transactionJSON,
  selectedPriority,
  numberOfSignatures = DEFAULT_NUMBER_OF_SIGNATURES,
  moduleCommandSchemas,
  senderAccount = { numberOfSignatures: 0, optionalKeys: [], mandatoryKeys: [] },
  token,
}) => {
  const feePerByte = selectedPriority.value;
  const moduleCommand = joinModuleAndCommand(transactionJSON);
  const paramsSchema = moduleCommandSchemas[moduleCommand];

  const maxCommandFee = MODULE_COMMANDS_MAP[moduleCommand].maxFee;
  const transactionObject = fromTransactionJSON(transactionJSON, paramsSchema);

  if (transactionJSON.moduleCommand === MODULE_COMMANDS_NAME_MAP.registerMultisignature) {
    const { optionalKeys, mandatoryKeys } = transactionJSON.params;
    numberOfSignatures = optionalKeys.length + mandatoryKeys.length;
  }

  const allocateEmptySignaturesWithEmptyBuffer = (signatureCount) =>
    new Array(signatureCount).fill(Buffer.alloc(64));

  // @TODO: implement transaction fee calculation based on domain fee constants
  const { mandatoryKeys, optionalKeys } = senderAccount;
  const minFee = transactions.computeMinFee(
    {
      ...transactionObject,
      params: {
        ...transactionObject.params,
        ...(numberOfSignatures &&
          !transactionObject.params.signatures?.length && {
            signatures: allocateEmptySignaturesWithEmptyBuffer(numberOfSignatures),
          }),
      },
    },
    paramsSchema,
    senderAccount.numberOfSignatures
      ? {
          numberOfSignatures: senderAccount.numberOfSignatures,
          numberOfEmptySignatures:
            mandatoryKeys.length + optionalKeys.length - senderAccount.numberOfSignatures,
        }
      : {}
  );

  // tie breaker is only meant for medium and high processing speeds
  const tieBreaker =
    selectedPriority.selectedIndex === 0 ? 0 : MIN_FEE_PER_BYTE * feePerByte * Math.random();
  const size = transactions.getBytes(transactionObject, paramsSchema).length;

  const calculatedFee = Number(minFee) + size * feePerByte + tieBreaker;
  const cappedFee = Math.min(calculatedFee, maxCommandFee);
  const fee = convertFromBaseDenom(cappedFee, token);
  const roundedValue = Number(fee).toFixed(7).toString();
  const feedback = transactionJSON.amount === '' ? '-' : `${roundedValue ? '' : 'Invalid amount'}`;

  return {
    value: roundedValue,
    error: !!feedback,
    feedback,
  };
};

/**
 * creates a new transaction
 *
 * @param {Object} transaction The transaction information
 * @param {String} transaction.moduleCommand The combination of module Id and asset Id.
 * @param {Object} transaction.network Network config from the redux store
 * @param {Object} transaction.keys keys of the multisig account
 * @param {Object} transaction.transactionObject Details of the transaction, including passphrase
 * @param {boolean} transaction.isHwSigning true if an hardware wallet will sign the transaction
 * @returns {Promise} promise that resolves to a transaction or
 * rejects with an error
 */
export const signTransaction = async ({
  schema,
  chainID,
  wallet,
  transactionJSON,
  privateKey,
  senderAccount,
}) => {
  const transaction = fromTransactionJSON(transactionJSON, schema);
  const result = await sign(wallet, schema, chainID, transaction, privateKey, senderAccount);

  return result;
};

/**
 * broadcasts a transaction over the network
 *
 * @param {object} transaction
 * @param {Object} network
 * @param {string} network.name - the network name, e.g. mainnet, betanet
 * @param {string} network.address - the node address e.g. https://service.lisk.com
 * @returns {Promise} promise that resolves to a transaction or rejects with an error
 */
export const broadcast = async ({ transaction, serviceUrl, moduleCommandSchemas }) => {
  const moduleCommand = joinModuleAndCommand({
    module: transaction.module,
    command: transaction.command,
  });
  const schema = moduleCommandSchemas[moduleCommand];
  const binary = transactions.getBytes(transaction, schema);
  const payload = binary.toString('hex');

  return http({
    method: 'POST',
    baseUrl: serviceUrl,
    path: httpPaths.transactions,
    data: { transaction: payload },
  });
};

/**
 * Dry run a transaction to verify if the transaction is valid to be broadcasted to network
 * @param {*} param0 
 * @returns 
 * {
  result: enum {
    INVALID = -1,
    FAIL = 0,
    OK = 1,
   },
   errorMessage?: string, 
   events: EventJSON [],
}
 */
export const dryRun = ({ transaction, serviceUrl, paramsSchema, skipVerify = false }) => {
  const transactionBytes = transactions.getBytes(transaction, paramsSchema);

  return http({
    method: 'POST',
    baseUrl: serviceUrl,
    path: httpPaths.dryRun,
    data: { transaction: transactionBytes.toString('hex'), skipVerify },
  });
};
