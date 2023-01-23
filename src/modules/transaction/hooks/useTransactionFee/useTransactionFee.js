import { useMemo } from 'react';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { useAuth } from '@auth/hooks/queries/useAuth';
import { computeTransactionFee, getParamsSchema } from './utils';
/**
 *
 * @param {object} data
 * @param {boolean} data.isValid Whether the transaction is valid or not. TxComposer defines this
 * @param {object} data.wallet The sender account info as returned by useDeprecatedAccount
 * @param {object[]} data.priorities An array of object as { value: number, title: string, selected: boolean }
 * @param {object} data.transaction Transaction object as Lisk Element expects without fee
 * @returns {object} The fee object with a total value, and a component value as an array of fees
 * that contribute in the total value
 */
export const useTransactionFee = ({ isValid, senderAddress, priorities, transaction }) => {
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

  const fee = useMemo(
    () => computeTransactionFee(transaction, schema, auth, priorities, isValid && !isSchemaLoading),
    [transaction, schema, auth, priorities, isValid, isSchemaLoading]
  );

  return {
    /* istanbul ignore next */
    isLoading: isSchemaLoading || isLoading,
    /* istanbul ignore next */
    isFetched: isSchemaFetched && isFetched,
    total: fee,
    components: [{ value: fee, type: 'bytesFee' }],
  };
};
