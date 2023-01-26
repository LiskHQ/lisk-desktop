import { useMemo } from 'react';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { useAuth } from '@auth/hooks/queries/useAuth';
import { computeTransactionMinFee, getParamsSchema } from './utils';
import { FEE_TYPES } from '../../constants';
import usePriorityFee from '../usePriorityFee';

export const useByteFee = ({ isFormValid, senderAddress, transactionJSON }) => {
  const {
    data: auth,
    isLoading,
    isFetched,
  } = useAuth({ config: { params: { address: senderAddress } } });
  const {
    moduleCommandSchemas,
    isLoading: isSchemaLoading,
    isFetched: isFetchedCommandSchema,
  } = useCommandSchema();

  const paramsSchema = getParamsSchema(transactionJSON, moduleCommandSchemas);

  const bytesFee = useMemo(() => {
    if (!isFormValid || isSchemaLoading) {
      return {
        result: { value: 0, type: FEE_TYPES.BYTES_FEE },
        isLoading: isLoading || isSchemaLoading,
        isFetched: false,
      };
    }

    const fee = computeTransactionMinFee(
      transactionJSON,
      paramsSchema,
      auth,
    );

    return {
      result: { value: fee, type: FEE_TYPES.BYTES_FEE },
      isLoading: isLoading || isSchemaLoading,
      isFetched: isFetchedCommandSchema && isFetched,
    };
  }, [transactionJSON, paramsSchema, auth, isFormValid, isSchemaLoading]);

  return bytesFee;
};

/**
 *
 * @param {object} data
 * @param {boolean} data.isFormValid Whether the transaction form is valid or not. TxComposer defines this
 * @param {string} data.senderAddress The sender address in Lisk 32 format
 * @param {object} data.transaction Transaction object as Lisk Element expects without fee
 * @returns {object} The fee object with a total value, and a component value as an array of fees
 * that contribute in the total value
 */
export const useTransactionFee = ({
  isFormValid,
  transactionJSON,
  senderAddress,
  selectedPriority = [],
  extraCommandFee = 0,
}) => {
  const {
    moduleCommandSchemas,
    isLoading: isSchemaLoading,
    isFetched: isSchemaFetched,
  } = useCommandSchema();
  const paramsSchema = getParamsSchema(transactionJSON, moduleCommandSchemas);

  const {
    result: bytesFee,
    isLoading: isLoadingByteFee,
    isFetched: isFetchedByteFee,
  } = useByteFee({
    senderAddress,
    isFormValid,
    transactionJSON,
  });

  const priorityFee = usePriorityFee({
    selectedPriority,
    transactionJSON,
    paramsSchema,
  });
  const components = [bytesFee, priorityFee].filter((item) => item.value > 0);
  const minimumFee = BigInt(bytesFee.value) + BigInt(extraCommandFee);

  return {
    isLoading: isSchemaLoading || isLoadingByteFee,
    isFetched: isSchemaFetched && isFetchedByteFee,
    minimumFee: minimumFee.toString(),
    transactionFee: (minimumFee + BigInt(priorityFee.value)).toString(),
    components,
  };
};
