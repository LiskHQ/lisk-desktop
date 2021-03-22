import { useSelector } from 'react-redux';
import { useEffect, useReducer } from 'react';
import {
  getTransactionFee,
} from '@utils/api/transaction';
import { actionTypes, reducer, getInitialState } from './reducer';

const useTransactionFeeCalculation = ({
  selectedPriority, transaction, token, account, priorityOptions,
}) => {
  const network = useSelector(state => state.network);
  const [state, dispatch] = useReducer(reducer, account, getInitialState);

  const findTransactionFee = async (actionType, params) => {
    const response = await getTransactionFee(params, token);
    dispatch({ type: actionType, payload: { response, account, token } });
  };

  useEffect(() => {
    findTransactionFee(
      actionTypes.setFee,
      {
        token, account, network, transaction, selectedPriority,
      },
    );

    findTransactionFee(
      actionTypes.setMaxAmount,
      {
        token,
        account,
        network,
        selectedPriority,
        transaction: { ...transaction, amount: account.token?.balance },
      },
    );

    findTransactionFee(
      actionTypes.setMinFee,
      {
        token,
        account,
        network,
        transaction,
        selectedPriority: priorityOptions[0],
      },
    );
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
