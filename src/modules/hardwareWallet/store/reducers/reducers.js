import { combineReducers } from 'redux';
import actionTypes from '../actions/actionTypes';

const accountsInitState = [];

/**
 *
 * @param {Object} state
 * @param {type: String, account: Array} action
 */
const accounts = (state = accountsInitState, action) => {
  switch (action.type) {
    case actionTypes.storeHWAccounts:
      return action.accounts;

    case actionTypes.removeHWAccounts:
      return accountsInitState;

    default:
      return state;
  }
};

const currentDeviceInitState = {
  deviceId: 0,
  model: '',
  brand: '',
  status: 'disconnected',
};

/**
 *
 * @param {Object} state
 * @param {type: String, data: Object} action
 */
const currentDevice = (state = currentDeviceInitState, action) => {
  switch (action.type) {
    case actionTypes.updateHWData:
      return {
        ...state,
        ...action.data,
      };

    default:
      return state;
  }
};

export default combineReducers({
  currentDevice,
  accounts,
});
