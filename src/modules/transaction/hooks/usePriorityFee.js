import { transactions } from '@liskhq/lisk-client';
import { fromTransactionJSON } from '../utils/encoding';
import { FEE_TYPES } from '../constants';

const usePriorityFee = ({ selectedPriority, transactionJSON, paramsSchema, isEnabled }) => {
  const feePerByte = selectedPriority.value;

  if (!isEnabled) return { type: FEE_TYPES.PRIORITY_FEE, value: 0 };

  try {
    const size = transactions.getBytes(
      fromTransactionJSON(transactionJSON, paramsSchema),
      paramsSchema
    )?.length;

    return { type: FEE_TYPES.PRIORITY_FEE, value: size * feePerByte || 0 };
  } catch (exp) {
    return { type: FEE_TYPES.PRIORITY_FEE, value: 0 };
  }
};

export default usePriorityFee;
