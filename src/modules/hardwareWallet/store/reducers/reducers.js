import actionTypes from '../actions/actionTypes';

// istanbul ignore next
const initAccounts = []
const hardwareWallet = (state = initAccounts, action) => {
  switch (action.type) {
    case actionTypes.storeAccounts:
      return action.accounts;
    case actionTypes.removeAccounts:
      return initAccounts;
    default:
      return state;
  }
};

export default hardwareWallet;
