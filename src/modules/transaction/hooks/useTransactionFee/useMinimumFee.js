/* istanbul ignore file */
import { useMemo } from 'react';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { useAuth } from '@auth/hooks/queries/useAuth';
import { computeTransactionMinFee, getParamsSchema } from './utils';
import { FEE_TYPES } from '../../constants';

/**
 * Calculates minimum transaction fee based on bytes as per Lisk protocol
 * @returns {object} The fee object with a result value, loading and fetched state as boolean
 */
export const useMinimumFee = ({ isFormValid, senderAddress, transactionJSON, extraCommandFee }) => {
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
      numberOfSignatures,
      extraCommandFee
    );

    return {
      result: { value: fee, type: FEE_TYPES.BYTES_FEE },
      isLoading: isLoading || isSchemaLoading,
      isFetched: isFetchedCommandSchema && isFetched,
    };
  }, [transactionJSON, paramsSchema, auth, isFormValid, isSchemaLoading]);

  return bytesFee;
};
