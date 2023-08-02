/* eslint-disable max-lines */
import { transactions } from '@liskhq/lisk-client';
import { joinModuleAndCommand } from 'src/modules/transaction/utils/moduleCommand';
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
