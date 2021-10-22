import { useSelector } from 'react-redux';
import { useEffect, useReducer } from 'react';
import { getTransactionFee } from '@api/transaction';
import { DEFAULT_NUMBER_OF_SIGNATURES } from '@constants';
import { actionTypes, reducer, getInitialState } from './reducer';

const getNumberOfSignatures = (account) => {
  if (account?.summary?.isMultisignature) {
    return account.keys.numberOfSignatures;
  }
  return DEFAULT_NUMBER_OF_SIGNATURES;
};

const useTransactionFeeCalculation = ({
  token, account, selectedPriority, transaction, priorityOptions,
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

    dispatch({ type: actionTypes.setMinFee, payload: { response: minFee, account, token } });

    const maxAmountFee = await getTransactionFee({
      ...params,
      transaction: { ...params.transaction, amount: account.token?.balance },
    }, token);

    dispatch({
      type: actionTypes.setMaxAmount,
      payload: { response: maxAmountFee, account, token },
    });
  };

  useEffect(() => {
    calculateTransactionFees({
      token,
      account,
      network,
      transaction,
      selectedPriority,
      numberOfSignatures: getNumberOfSignatures(account),
    });
  }, [
    transaction.amount,
    transaction.data,
    transaction.recipientAddress,
    transaction.username,
    selectedPriority.selectedIndex,
    selectedPriority.value,
    transaction.mandatoryKeys,
    transaction.optionalKeys,
  ]);

  return state;
};

export default useTransactionFeeCalculation;
