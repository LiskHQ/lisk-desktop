/* eslint-disable import/prefer-default-export */
import { tokenMap } from '@token/configuration/tokens';
import { MIN_ACCOUNT_BALANCE } from '@transaction/configuration/transactions';
import { toRawLsk } from '@token/utilities/lsk';

const calculateAvailableBalance = (balance, token) => {
  if (token !== tokenMap.LSK.key) {
    return balance;
  }
  return Math.max(balance - MIN_ACCOUNT_BALANCE, 0);
};

const initialFee = {
  value: 0,
  error: false,
  feedback: '',
};

const getInitialState = wallet => ({
  fee: initialFee,
  minFee: initialFee,
  maxAmount: {
    value: wallet.token?.balance,
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
      const balance = action.payload.wallet.token?.balance;
      const token = action.payload.token;
      const availableBalance = calculateAvailableBalance(balance, token);
      const result = {
        ...action.response,
        maxAmount: {
          ...state.maxAmount,
          value: availableBalance - toRawLsk(action.payload.response.value),
        },
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
