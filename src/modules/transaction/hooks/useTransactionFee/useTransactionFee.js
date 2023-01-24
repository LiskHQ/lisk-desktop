import { useMemo } from 'react';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { useAuth } from '@auth/hooks/queries/useAuth';
import { computeTransactionMinFee, getParamsSchema } from './utils';
import { useCommandFee } from './useCommandFee';
import { FEE_TYPES } from './constants';

const getTotalFee = (components) =>
  components.reduce((acc, { value }) => acc + value, 0);

/**
 *
 * @param {object} data
 * @param {boolean} data.isValid Whether the transaction is valid or not. TxComposer defines this
 * @param {string} data.senderAddress The sender address in Lisk 32 format
 * @param {object} data.transaction Transaction object as Lisk Element expects without fee
 * @returns {object} The fee object with a total value, and a component value as an array of fees
 * that contribute in the total value
 */
export const useTransactionFee = ({ isValid, senderAddress, transaction }) => {
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
  const schema = getParamsSchema(transaction, moduleCommandSchemas);
  const commandFees = useCommandFee(transaction);

  const bytesFee = useMemo(
    () => {
      const fee = computeTransactionMinFee(transaction, schema, auth, isValid && !isSchemaLoading);
      return { value: fee, type: FEE_TYPES.BYTES_FEE };
    },
    [transaction, schema, auth, isValid, isSchemaLoading]
  );

  // @todo Assert the returned value when all fee components are defined
  const components = [
    bytesFee,
    ...commandFees,
  ].filter(item => item.value > 0);
  return {
    isLoading: isSchemaLoading || /* istanbul ignore next */ isLoading,
    isFetched: isSchemaFetched && /* istanbul ignore next */ isFetched,
    total: getTotalFee(components),
    components,
  };
};
