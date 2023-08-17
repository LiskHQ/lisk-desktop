/* eslint-disable max-lines */
import { transactions } from '@liskhq/lisk-client';
import { joinModuleAndCommand } from 'src/modules/transaction/utils/moduleCommand';
import http from 'src/utils/api/http';
import to from 'await-to-js';
import { httpPaths } from '../configuration';
import { sign } from '../utils';
import { fromTransactionJSON } from '../utils/encoding';
import { ERROR_EVENTS, TransactionExecutionResult } from '../constants';

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

const getDryRunErrors = (events) => {
  const event = events?.find((e) => ERROR_EVENTS[e.name]);

  if (event) {
    return ERROR_EVENTS[event.name];
  }

  return 'Failed to process transaction, error events unknown.';
};

/**
 * Dry run a transaction to verify if the transaction is valid to be broadcasted to network
 */
export const dryRunTransaction = async ({ transaction, paramsSchema, skipVerify = false }) => {
  const transactionBytes = transactions.getBytes(transaction, paramsSchema);

  const [error, response] = await to(
    http({
      method: 'POST',
      path: httpPaths.dryRun,
      data: { transaction: transactionBytes.toString('hex'), skipVerify },
    })
  );

  const isOk = response?.data?.result === TransactionExecutionResult.OK;
  let errorMessage = error?.message || response?.data?.errorMessage;

  if (!isOk && !errorMessage) {
    errorMessage = getDryRunErrors(response?.data?.events);
  }

  return {
    isOk,
    errorMessage,
    response,
  };
};
