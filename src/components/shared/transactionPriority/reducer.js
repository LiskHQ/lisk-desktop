/* eslint-disable import/prefer-default-export */
import { tokenMap, minAccountBalance } from '@constants';
import { toRawLsk } from '@utils/lsk';

const calculateAvailableBalance = (balance, token) => {
  if (token !== tokenMap.LSK.key) {
    return balance;
  }
  return Math.max(balance - minAccountBalance, 0);
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
    value: account.token?.balance,
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
      const balance = action.payload.account.token?.balance;
      const token = action.payload.token;
      const availableBalance = calculateAvailableBalance(balance, token);
      const result = {
        ...action.response,
        value: availableBalance - toRawLsk(action.payload.response.value),
      };

      return { ...state, ...result };
    }

    default:
      throw Error(`reducer not implemented for ${action}`);
  }
};

export {
  actionTypes,
  getInitialState,
  reducer,
};
