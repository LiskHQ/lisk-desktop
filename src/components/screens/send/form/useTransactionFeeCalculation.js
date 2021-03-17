import { useSelector } from 'react-redux';
import { useEffect, useReducer } from 'react';
import { tokenMap, minAccountBalance } from '@constants';
import {
  getTransactionFee,
} from '@utils/api/transaction';
import { toRawLsk } from '@utils/lsk';

const calculateAvailableBalance = (balance, token) => {
  if (token !== tokenMap.LSK.key) {
    return balance;
  }
  if (balance <= minAccountBalance) {
    return balance;
  }
  return balance - minAccountBalance;
};

const initialFee = {
  value: 0,
  error: false,
  feedback: '',
};

const getInitialState = account => ({
  fee: initialFee,
  minFee: initialFee,
  maxAmount: {
    value: account.balance,
    error: false,
    feedback: '',
  },
});

const actionTypes = {
  setFee: 'SET_FEE',
  setMinFee: 'SET_MIN_FEE',
  setMaxAmount: 'SET_MAX_AMOUNT',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.setFee:
      return { ...state, fee: action.payload.response };

    case actionTypes.setMinFee:
      return { ...state, minFee: action.payload.response };

    case actionTypes.setMaxAmount: {
      const balance = action.payload.account.balance;
      const token = action.payload.token;
      const availableBalance = calculateAvailableBalance(balance, token);
      const result = {
        ...action.response,
        value: availableBalance - toRawLsk(action.params.value),
      };

      return { ...state, ...result };
    }

    default:
      throw Error(`reducer not implemented for ${action}`);
  }
};

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
        transaction: { ...transaction, amount: account.balance },
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
