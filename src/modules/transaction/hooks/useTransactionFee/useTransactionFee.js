/* eslint-disable complexity */
/* eslint-disable max-statements */
import { useMemo } from 'react';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { useAuth } from '@auth/hooks/queries/useAuth';
import { usePosConstants } from '@pos/validator/hooks/queries';
import { useTokensBalance } from '@token/fungible/hooks/queries';
import { computeTransactionMinFee, getParamsSchema } from './utils';
import { useCommandFee } from './useCommandFee';
import { FEE_TYPES } from './constants';
import usePriorityFee from '../usePriorityFee';
import { joinModuleAndCommand } from '../../utils';
import { MODULE_COMMANDS_MAP } from '../../configuration/moduleCommand';

const useGenerateTxWithMaxBalance = ({ transaction = {} }) => {
  const moduleCommand = joinModuleAndCommand(transaction);

  const { data: posConstants, isLoading: isGettingPosConstants } = usePosConstants();
  const { data: tokens, isSuccess: isTokenSuccess } = useTokensBalance({
    config: { params: { tokenID: transaction.params.token?.tokenID || posConstants?.posTokenID } },
    option: {
      enabled:
        !isGettingPosConstants &&
        (moduleCommand === MODULE_COMMANDS_MAP.transfer ||
          MODULE_COMMANDS_MAP.crossChainTransfer ||
          moduleCommand === MODULE_COMMANDS_MAP.stake),
    },
  });

  const token = tokens?.data?.[0] || {};

  if (moduleCommand === MODULE_COMMANDS_MAP.stake && isTokenSuccess) {
    const maxAmountPerStake = +token.availableBalance / (transaction.params?.stakes?.length || 1);
    const maxStakes = transaction.params.stakes.map(({ amount, ...rest }) => ({
      ...rest,
      amount: maxAmountPerStake.toString(),
    }));

    return { ...transaction, params: { ...transaction.params, stakes: maxStakes } };
  }

  if (
    isTokenSuccess &&
    (moduleCommand === MODULE_COMMANDS_MAP.transfer || MODULE_COMMANDS_MAP.crossChainTransfer)
  ) {
    return { ...transaction, params: { ...transaction.params, amount: token.availableBalance } };
  }

  return transaction;
};

const getTotalFee = (components) => components.reduce((acc, { value }) => acc + value, 0);

/**
 *
 * @param {object} data
 * @param {boolean} data.isValid Whether the transaction is valid or not. TxComposer defines this
 * @param {string} data.senderAddress The sender address in Lisk 32 format
 * @param {object} data.transaction Transaction object as Lisk Element expects without fee
 * @returns {object} The fee object with a total value, and a component value as an array of fees
 * that contribute in the total value
 */
export const useTransactionFee = ({
  isValid,
  senderAddress,
  transaction,
  selectedPriority = [],
}) => {
  const {
    data: auth,
    isLoading,
    isFetched,
  } = useAuth({ config: { params: { address: senderAddress } } });
  const {
    moduleCommandSchemas,
    isLoading: isSchemaLoading,
    isFetched: isSchemaFetched,
  } = useCommandSchema();

  const paramsSchema = getParamsSchema(transaction, moduleCommandSchemas);

  const txWithMaxBalance = useGenerateTxWithMaxBalance({ transaction });
  const priorityFee = usePriorityFee({ selectedPriority, paramsSchema, transaction });
  const commandFees = useCommandFee(transaction);

  const maxPriorityFee = usePriorityFee({
    selectedPriority,
    paramsSchema,
    transaction: txWithMaxBalance,
  });
  const maxCommandFees = useCommandFee(txWithMaxBalance);

  const bytesFee = useMemo(() => {
    const fee = computeTransactionMinFee(
      transaction,
      paramsSchema,
      auth,
      isValid && !isSchemaLoading
    );
    return { value: fee, type: FEE_TYPES.BYTES_FEE };
  }, [transaction, paramsSchema, auth, isValid, isSchemaLoading]);

  const maxBytesFee = useMemo(() => {
    const fee = computeTransactionMinFee(
      txWithMaxBalance,
      paramsSchema,
      auth,
      isValid && !isSchemaLoading
    );
    return { value: fee, type: FEE_TYPES.BYTES_FEE };
  }, [txWithMaxBalance, paramsSchema, auth, isValid, isSchemaLoading]);

  const components = [bytesFee, priorityFee, ...commandFees].filter((item) => item.value > 0);
  const maxFeeComponents = [maxPriorityFee, maxBytesFee, ...maxCommandFees].filter(
    (item) => item.value > 0
  );
  return {
    isLoading: isSchemaLoading || /* istanbul ignore next */ isLoading,
    isFetched: isSchemaFetched && /* istanbul ignore next */ isFetched,
    totalFee: getTotalFee(components),
    totalMaxFee: getTotalFee(maxFeeComponents),
    components,
  };
};
