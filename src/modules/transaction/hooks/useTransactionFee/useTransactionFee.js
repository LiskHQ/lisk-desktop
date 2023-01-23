import { useMemo } from 'react';
import { useCommandSchema } from '@network/hooks/useCommandsSchema';
import { useAuth } from '@auth/hooks/queries/useAuth';
import { computeTransactionMinFee, getParamsSchema } from './utils';
/**
 *
 * @param {object} data
 * @param {boolean} data.isValid Whether the transaction is valid or not. TxComposer defines this
 * @param {object} data.wallet The sender account info as returned by useDeprecatedAccount
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

  const fee = useMemo(
    () => computeTransactionMinFee(transaction, schema, auth, isValid && !isSchemaLoading),
    [transaction, schema, auth, isValid, isSchemaLoading]
  );

  return {
    isLoading: isSchemaLoading || /* istanbul ignore next */ isLoading,
    isFetched: isSchemaFetched && /* istanbul ignore next */ isFetched,
    total: fee,
    components: [{ value: fee, type: 'bytesFee' }],
  };
};
