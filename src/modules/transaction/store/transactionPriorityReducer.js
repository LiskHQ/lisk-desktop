/* eslint-disable import/prefer-default-export */
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
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.setFee:
      return { ...state, fee: action.payload.response };

    case actionTypes.setMinFee:
      return { ...state, minFee: action.payload.response };

    default:
      throw Error(`reducer not implemented for ${action}`);
  }
};

export {
  actionTypes,
  getInitialState,
  reducer,
};
