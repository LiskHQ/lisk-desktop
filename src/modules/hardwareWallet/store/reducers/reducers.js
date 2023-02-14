import actionTypes from '../actions/actionTypes';

// istanbul ignore next
const initAccounts = [];
const initState = {
  deviceId: 0,
  status: 'disconnected',
  accounts: initAccounts,
};

const hardwareWallet = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.storeAccounts:
      return {
        ...state,
        accounts: action.accounts,
      };
    case actionTypes.removeAccounts:
      return {
        ...state,
        accounts: initAccounts,
      };
    default:
      return state;
  }
};

export default hardwareWallet;
