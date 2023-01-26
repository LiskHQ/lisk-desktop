/* eslint-disable complexity */
/* eslint-disable max-statements */
import { useMemo } from 'react';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { useAuth } from '@auth/hooks/queries/useAuth';
import { computeTransactionMinFee, getParamsSchema } from './utils';
import { FEE_TYPES } from '../../constants';
import usePriorityFee from '../usePriorityFee';
import { fromTransactionJSON } from '../../utils/encoding';

export const useByteFee = ({ isValid, senderAddress, transactionJSON }) => {
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

  const numberOfSignatures = auth?.data?.numberOfSignatures || 1;
  const paramsSchema = getParamsSchema(transactionJSON, moduleCommandSchemas);

  const bytesFee = useMemo(() => {
    if (!isValid) {
      return {
        result: { value: 0, type: FEE_TYPES.BYTES_FEE },
        isLoading: isLoading || isSchemaLoading,
        isFetched: false,
      };
    }

    const transaction = {
      ...fromTransactionJSON(transactionJSON),
      signatures: new Array(numberOfSignatures).fill(Buffer.alloc(64)),
    };

    const fee = computeTransactionMinFee(
      transaction,
      paramsSchema,
      auth,
      isValid && !isSchemaLoading
    );

    return {
      result: { value: fee, type: FEE_TYPES.BYTES_FEE },
      isLoading: isLoading || isSchemaLoading,
      isFetched: isFetchedCommandSchema && isFetched,
    };
  }, [transactionJSON, paramsSchema, auth, isValid, isSchemaLoading]);

  return bytesFee;
};

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
    isValid,
    transactionJSON,
  });

  const priorityFee = usePriorityFee({
    selectedPriority,
    transactionJSON,
    paramsSchema,
  });
  const components = [bytesFee, priorityFee].filter((item) => item.value > 0);

  return {
    minimumFee: Number(bytesFee.value) + extraCommandFee,
    isLoading: isSchemaLoading || /* istanbul ignore next */ isLoadingByteFee,
    isFetched: isSchemaFetched && /* istanbul ignore next */ isFetchedByteFee,
    transactionFee: Number(bytesFee.value) + Number(priorityFee.value) + extraCommandFee,
    components,
  };
};
