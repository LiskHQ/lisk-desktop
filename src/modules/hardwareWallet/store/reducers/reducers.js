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
    case actionTypes.storeHWAccounts:
      return {
        ...state,
        accounts: action.accounts,
      };
    case actionTypes.removeHWAccounts:
      return {
        ...state,
        accounts: initAccounts,
      };
    default:
      return state;
  }
};

export default hardwareWallet;
