import { useSelector } from 'react-redux';
import { useEffect, useReducer } from 'react';
import {
  getTransactionFee,
} from '@api/transaction';
import { actionTypes, reducer, getInitialState } from './reducer';

const useTransactionFeeCalculation = ({
  selectedPriority, transaction, token, account, priorityOptions, numberOfSignatures,
}) => {
  const network = useSelector(state => state.network);
  const [state, dispatch] = useReducer(reducer, account, getInitialState);

  const calculateTransactionFees = async (params) => {
    const fee = await getTransactionFee(params, token);
    dispatch({ type: actionTypes.setFee, payload: { response: fee, account, token } });

    const minFee = await getTransactionFee({
      ...params,
      selectedPriority: priorityOptions[0],
    }, token);
    dispatch({ type: actionTypes.setMaxAmount, payload: { response: minFee, account, token } });

    const maxAmount = await getTransactionFee({
      ...params,
      transaction: { ...params.transaction, amount: account.token?.balance },
    }, token);
    dispatch({ type: actionTypes.setMaxAmount, payload: { response: maxAmount, account, token } });
  };

  useEffect(() => {
    calculateTransactionFees({
      token, account, network, transaction, selectedPriority, numberOfSignatures,
    });
  }, [
    transaction.amount,
    transaction.data,
    transaction.recipient,
    transaction.username,
    selectedPriority.selectedIndex,
    selectedPriority.value,
  ]);

  return state;
};

export default useTransactionFeeCalculation;
