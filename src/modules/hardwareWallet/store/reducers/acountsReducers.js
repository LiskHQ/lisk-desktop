import actionTypes from '../actions/actionTypes';

const initAccounts = [];

export const accounts = (state = initAccounts, {type, accounts: hwAccount= initAccounts}) => {
  switch (type) {
    case actionTypes.storeHWAccounts:
      return hwAccount;
    case actionTypes.removeHWAccounts:
      return initAccounts;
    default:
      return state;
  }
};
