import actionTypes from '../actions/actionTypes';

// istanbul ignore next
const hardwareWallet = (state = [], action) => {
  switch (action.type) {
    case actionTypes.storeAccounts:
      return [...state, ...action.accounts];

    case actionTypes.removeAccounts:
      return state;

    default:
      return state;
  }
};

export default hardwareWallet;
