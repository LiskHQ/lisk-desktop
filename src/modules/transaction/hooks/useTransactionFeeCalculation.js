import { useEffect, useReducer } from 'react';
import { useCommandSchema } from '@network/hooks';
import { getTransactionFee } from '../api';
import { getNumberOfSignatures } from '../utils/transaction';
import { actionTypes, reducer, getInitialState } from '../store/transactionPriorityReducer';

/**
 * Custom hook to define tx fee
 *
 * @param {object} data
 * @param {string} data.token - Option of LSK or any other token
 * @param {object} data.wallet - Active wallet info
 * @param {object} data.selectedPriority - Selected priority info
 * @param {object} data.transaction - Raw transaction payload
 * @param {array} data.priorityOptions - Array of priority configs for High, Mid, Low
 * @returns {object}
 */
const useTransactionFeeCalculation = ({
  token,
  wallet,
  selectedPriority,
  transactionJSON,
  priorityOptions,
}) => {
  const [state, dispatch] = useReducer(reducer, wallet, getInitialState);
  const { moduleCommandSchemas } = useCommandSchema();

  const calculateTransactionFees = async (params) => {
    const fee = await getTransactionFee(params);
    dispatch({ type: actionTypes.setFee, payload: { response: fee, wallet, token } });

    const minFee = await getTransactionFee({
      ...params,
      selectedPriority: priorityOptions[0],
    });

    dispatch({ type: actionTypes.setMinFee, payload: { response: minFee, wallet, token } });

    const maxAmountFee = await getTransactionFee({
      ...params,
      transaction: { ...params.transaction, amount: wallet.token?.balance },
    });

    dispatch({
      type: actionTypes.setMaxAmount,
      payload: { response: maxAmountFee, wallet, token },
    });
  };

  useEffect(() => {
    // istanbul ignore else
    if (moduleCommandSchemas) {
      calculateTransactionFees({
        token,
        wallet,
        moduleCommandSchemas,
        transactionJSON,
        selectedPriority,
        numberOfSignatures: getNumberOfSignatures(wallet, transactionJSON),
      });
    }
  }, [
    transactionJSON.params,
    selectedPriority.selectedIndex,
    selectedPriority.value
  ]);

  return state;
};

export default useTransactionFeeCalculation;
