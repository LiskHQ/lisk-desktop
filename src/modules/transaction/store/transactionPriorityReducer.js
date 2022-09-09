/* eslint-disable import/prefer-default-export */
import { MIN_ACCOUNT_BALANCE } from '@transaction/configuration/transactions';
import { toRawLsk } from '@token/fungible/utils/lsk';

const calculateAvailableBalance = (balance) => Math.max(balance - MIN_ACCOUNT_BALANCE, 0);

const initialFee = {
  value: 0,
  error: false,
  feedback: '',
};

const getInitialState = (wallet) => ({
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
      const availableBalance = calculateAvailableBalance(balance);
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

export { actionTypes, getInitialState, reducer };
