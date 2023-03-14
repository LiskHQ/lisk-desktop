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
import { fromRawLsk } from '@token/fungible/utils/lsk';
import { validateAddress } from 'src/utils/validators';
import http from 'src/utils/api/http';
import { getValidators } from '@pos/validator/api';
import { httpPaths } from '../configuration';
import { sign } from '../utils';
import { fromTransactionJSON } from '../utils/encoding';

const filters = {
  address: { key: 'address', test: (address) => !validateAddress(address) },
  senderAddress: { key: 'senderAddress', test: (address) => !validateAddress(address) },
  recipientAddress: { key: 'recipientAddress', test: (address) => !validateAddress(address) },
  timestamp: { key: 'timestamp', test: (str) => /^(\d+)?:(\d+)?$/.test(str) },
  amount: { key: 'amount', test: (str) => /^(\d+)?:(\d+)?$/.test(str) },
  limit: { key: 'limit', test: (num) => parseInt(num, 10) > 0 },
  offset: { key: 'offset', test: (num) => parseInt(num, 10) >= 0 },
  moduleCommand: { key: 'moduleCommand', test: (str) => /\d:\d/.test(str) },
  height: { key: 'height', test: (num) => parseInt(num, 10) > 0 },
  blockId: { key: 'blockId', test: (str) => typeof str === 'string' },
  sort: {
    key: 'sort',
    test: (str) =>
      [
        'amount:asc',
        'amount:desc',
        'fee:asc',
        'fee:desc',
        'timestamp:asc',
        'timestamp:desc',
      ].includes(str),
  },
};

/**
 * Retrieves the list of transactions for given parameters
 *
 * @param {Object} data
 * @param {Object} data.network - Network setting from Redux store
 * @param {String?} data.baseUrl - Lisk Service API url to override the
 * existing ServiceUrl on the network param. We may use this to retrieve
 * the details of an archived transaction.
 * @param {Object} data.params
 * @param {String} data.params.blockId The id of the block in which txs are included
 * @param {String} data.params.address Sender or recipient account
 * @param {String} data.params.dateFrom Unix timestamp, the start time of txs
 * @param {String} data.params.dateTo Unix timestamp, the end time of txs
 * @param {String} data.params.amountFrom The minimum value of txs
 * @param {String} data.params.amountTo The maximum value of txs
 * @param {String} data.params.moduleCommand The moduleCommand. 2:0, 5:1, etc
 * @param {Number} data.params.offset Used for pagination
 * @param {Number} data.params.limit Used for pagination
 * @param {String} data.params.sort an option of 'amount:asc',
 * 'amount:desc', 'timestamp:asc', 'timestamp:desc',
 * @param {Object} data.params.height The height of the block whose transaction we want.
 * If passed, all other parameter will be ignored.
 * @returns {Promise} Transactions list API call
 */
export const getTransactions = ({ network, params, baseUrl }) => {
  const normParams = {};
  // Validate params and fix keys
  Object.keys(params).forEach((key) => {
    if (filters[key] && filters[key].test(params[key])) {
      normParams[filters[key].key] = params[key];
    } else {
      // eslint-disable-next-line no-console
      console.log(`getTransactions: Dropped ${key} parameter, it's invalid.`, params[key]);
    }
  });

  return http({
    network,
    path: httpPaths.transactions,
    params: normParams,
    baseUrl,
  });
};

/**
 * Fetches and generates an array of monthly number of validator
 * registrations on Lisk blockchain.
 *
 * @param {Object} Network - Network setting from Redux store
 * @returns {Promise} Registered validators list API call
 */
export const getRegisteredValidators = async ({ network }) => {
  const validators = await getValidators({
    network,
    params: { limit: 1 },
  });
  const txs = await getTransactions({
    network,
    params: { moduleCommand: 'pos:registerValidator', limit: 100 },
  });

  if (validators.error || txs.error) {
    return Error('Error fetching data.');
  }

  const getDate = (timestamp) => {
    const d = new Date(timestamp * 1000);
    return `${new Date(d).getFullYear()}-${new Date(d).getMonth() + 1}`;
  };

  // create monthly number of registration as a dictionary
  const monthStats = txs.data
    .map((tx) => tx.block.timestamp)
    .reduce((acc, timestamp) => {
      const date = getDate(timestamp);
      acc[date] = typeof acc[date] === 'number' ? acc[date] + 1 : 1;
      return acc;
    }, {});

  // Create a sorted array of monthly accumulated number of registrations
  const res = Object.keys(monthStats)
    .sort((a, b) => -1 * (b - 1))
    .reduce(
      (acc, month) => {
        if (acc[0][0] === month) {
          acc.unshift([null, acc[0][1] - monthStats[month]]);
        } else if (acc[0][0] === null) {
          acc[0][0] = month;
          acc.unshift([null, acc[0][1] - monthStats[month]]);
        }

        return acc;
      },
      [[getDate(txs.data[0].block.timestamp), validators.meta.total]]
    );

  // Add the date of one month before the last tx
  res[0][0] = getDate(txs.data[txs.data.length - 1].block.timestamp - 2670000);

  return res;
};

/**
 * Retrieves the overall statistics of network transactions.
 *
 * @param {Object} data
 * @param {Object} data.params
 * @param {String} data.params.period - An option of 'day' or 'month'
 * @param {Number} data.params.limit - The number of results
 * @param {Object} data.network - Network setting from Redux store
 * @returns {Object} Network transactions statistics
 */
export const getTransactionStats = ({ network, params: { period } }) => {
  const normParams = {
    week: { path: 'day', limit: 7 },
    month: { path: 'month', limit: 6 },
    year: { path: 'month', limit: 12 },
  };

  return http({
    path: `${httpPaths.transactionStats}/${normParams[period].path}`,
    params: { limit: normParams[period].limit },
    network,
  });
};

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
 *
 * @param {String} txData - The transaction object
 * @param {Object} selectedPriority - network configuration
 * @returns {Promise} Object containing value, error and feedback
 */
// eslint-disable-next-line max-statements
export const getTransactionFee = async ({
  transactionJSON,
  selectedPriority,
  numberOfSignatures = DEFAULT_NUMBER_OF_SIGNATURES,
  moduleCommandSchemas,
  senderAccount = { numberOfSignatures: 0, optionalKeys: [], mandatoryKeys: [] },
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
  const feeInLsk = fromRawLsk(cappedFee.toString());
  const roundedValue = Number(feeInLsk).toFixed(7).toString();
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
export const dryRun = ({ transaction, serviceUrl, network, full }) => {
  const moduleCommand = joinModuleAndCommand({
    module: transaction.module,
    command: transaction.command,
  });
  console.log({ moduleCommand });
  const schema = network.networks.LSK.moduleCommandSchemas[moduleCommand];
  if (!full) {
    const binary = transactions.getBytes(transaction, schema);
    const payload = binary.toString('hex');

    return http({
      method: 'POST',
      baseUrl: serviceUrl,
      path: httpPaths.dryRun,
      data: { transaction: payload },
    });
  }

  return http({
    method: 'POST',
    baseUrl: serviceUrl,
    path: httpPaths.dryRun,
    data: { transaction, isSkipVerify: true },
  });
};
