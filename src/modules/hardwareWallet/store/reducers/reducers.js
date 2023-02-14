import actionTypes from '../actions/actionTypes';

const initAccounts = [];
const initState = {
  deviceId: 0,
  status: 'disconnected',
  accounts: initAccounts,
};

// istanbul ignore next
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
