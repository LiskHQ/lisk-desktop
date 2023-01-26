import { transactions } from '@liskhq/lisk-client';
import { fromTransactionJSON } from '../utils/encoding';
import { FEE_TYPES } from '../constants';

const usePriorityFee = ({ selectedPriority, transactionJSON, paramsSchema }) => {
  const feePerByte = selectedPriority.value;

  try {
    const size = transactions.getBytes(
      fromTransactionJSON(transactionJSON, paramsSchema),
      paramsSchema
    ).length;

    return { type: FEE_TYPES.PRIORITY_FEE, value: size * feePerByte };
  } catch (exp) {
    return { type: FEE_TYPES.PRIORITY_FEE, value: 0 };
  }
};

export default usePriorityFee;
