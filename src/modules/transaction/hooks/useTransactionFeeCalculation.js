import { useEffect, useMemo, useReducer } from 'react';
import { useAuth } from '@auth/hooks/queries';
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
  const { data: account } = useAuth({ config: { params: { address: wallet?.summary?.address } } });
  const senderAccount = useMemo(() => account?.data || {}, [account]);

  const calculateTransactionFees = async (params) => {
    // @TODO: we need to find out why fee and minFee have the same implementations
    const fee = await getTransactionFee({
      ...params,
      senderAccount,
      selectedPriority: priorityOptions[0],
      token,
    });
    dispatch({ type: actionTypes.setFee, payload: { response: fee, wallet, token } });

    const minFee = await getTransactionFee({
      ...params,
      senderAccount,
      selectedPriority: priorityOptions[0],
      token,
    });
    dispatch({ type: actionTypes.setMinFee, payload: { response: minFee, wallet, token } });

    const maxAmountFee = await getTransactionFee({
      ...params,
      senderAccount,
      transactionJSON: { ...params.transactionJSON, amount: wallet.token?.balance },
      token,
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
    selectedPriority.value,
    senderAccount,
    moduleCommandSchemas,
  ]);

  return state;
};

export default useTransactionFeeCalculation;
