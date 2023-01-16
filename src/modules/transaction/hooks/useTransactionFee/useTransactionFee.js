import { useEffect, useState } from 'react';
import { useCommandSchema } from '@network/hooks';
import { useAuth } from '@auth/hooks/queries';
import { computeFee, getParamsSchema } from './utils';
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
export const useTransactionFee = ({
  isValid,
  wallet,
  priorities,
  transaction,
}) => {
  const [fee, setFee] = useState(0);
  const { data: auth } = useAuth({ config: { params: { address: wallet?.summary?.address } } });
  const { moduleCommandSchemas } = useCommandSchema();
  const schema = getParamsSchema(transaction, moduleCommandSchemas);

  useEffect(() => {
    setFee(computeFee(transaction, schema, auth, priorities, isValid));
  }, [
    priorities,
  ]);

  return {
    total: fee,
    components: [
      { value: fee, type: 'bytesFee' },
    ],
  };
};
