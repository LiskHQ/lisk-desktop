/* eslint-disable max-lines */
import { transactions } from '@liskhq/lisk-client';
import { joinModuleAndCommand } from 'src/modules/transaction/utils/moduleCommand';
import http from 'src/utils/api/http';
import to from 'await-to-js';
import { httpPaths } from '../configuration';
import { sign } from '../utils';
import { fromTransactionJSON } from '../utils/encoding';
import {
  ERROR_EVENTS,
  TOKEN_EVENT_DATA_RESULT,
  VALIDATOR_EVENT_DATA_RESULT,
  TransactionExecutionResult,
} from '../constants';
import { MODULE_COMMANDS_NAME_MAP } from '../configuration/moduleCommand';

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
  })?.then((response) => {
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

const getEventDataResultError = (events, moduleCommand) => {
  const event = events?.find((e) => e.data?.result && e.data?.result !== 0);

  if (event) {
    switch (moduleCommand) {
      case MODULE_COMMANDS_NAME_MAP.transfer || MODULE_COMMANDS_NAME_MAP.transferCrossChain:
        return TOKEN_EVENT_DATA_RESULT[event.data.result];
      case MODULE_COMMANDS_NAME_MAP.registerValidator:
        return VALIDATOR_EVENT_DATA_RESULT[event.data.result];
      case MODULE_COMMANDS_NAME_MAP.stake || MODULE_COMMANDS_NAME_MAP.unlock:
        return TOKEN_EVENT_DATA_RESULT[event.data.result];
      default:
        return `Transaction dry run failed for module: ${event.module}, name: ${event.name} and result: ${event.data.result}, hence aborting next step.`;
    }
  }

  return 'Transaction dry run failed with no events, hence aborting next step.';
};

const getDryRunErrors = (events, moduleCommand) => {
  const event = events?.find((e) => ERROR_EVENTS[e.name]);

  if (event) {
    return ERROR_EVENTS[event.name];
  }

  return getEventDataResultError(events, moduleCommand);
};

/**
 * Dry run a transaction to verify if the transaction is valid to be broadcasted to network.
 * skipVerify : default (false) should be true when transaction requires its command verify step to be skipped.
 * strict: default (false) should be true when transaction has signature.
 */
export const dryRunTransaction = async ({
  transaction,
  paramsSchema,
  skipVerify = false,
  strict = false,
}) => {
  const transactionBytes = transactions.getBytes(transaction, paramsSchema);

  const [error, response] = await to(
    http({
      method: 'POST',
      path: httpPaths.dryRun,
      data: { transaction: transactionBytes.toString('hex'), skipVerify, strict },
    })
  );

  const isOk = response?.data?.result === TransactionExecutionResult.OK;
  let errorMessage = error?.message || response?.data?.errorMessage;

  if (!isOk && !errorMessage) {
    const moduleCommand = joinModuleAndCommand({
      module: transaction.module,
      command: transaction.command,
    });

    errorMessage = getDryRunErrors(response?.data?.events, moduleCommand);
  }

  return {
    isOk,
    errorMessage,
    response,
  };
};
