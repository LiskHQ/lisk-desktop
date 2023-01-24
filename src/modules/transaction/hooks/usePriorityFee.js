import { transactions } from "@liskhq/lisk-client";
import { FEE_TYPES } from "./useTransactionFee/constants";

// eslint-disable-next-line max-statements
const usePriorityFee = ({ selectedPriority, transaction, paramsSchema }) => {
  const feePerByte = selectedPriority.value

  const size = transactions.getBytes(transaction, paramsSchema).length;
  return { type:  FEE_TYPES.PRIORITY_FEE , value: size * feePerByte }
};

export default usePriorityFee;
