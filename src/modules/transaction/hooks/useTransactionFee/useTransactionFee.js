import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { getParamsSchema } from './utils';
import usePriorityFee from '../usePriorityFee';
import { useByteFee } from './useByteFee';

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

  const priorityFee = { value: 0 }; usePriorityFee({
    selectedPriority,
    transactionJSON,
    paramsSchema,
    isEnabled: !!paramsSchema && isFormValid,
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
