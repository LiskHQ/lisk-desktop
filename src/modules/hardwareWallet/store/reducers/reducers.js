import actionTypes from '../actions/actionTypes';

const initialState = [];

const hardwareWallet = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.storeAccounts:
      return [...state, action.data];

    case actionTypes.removeAccounts:
      return initialState;

    default:
      return state;
  }
};

export default hardwareWallet;
