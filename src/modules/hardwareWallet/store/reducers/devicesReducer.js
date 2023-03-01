import actionTypes from '@hardwareWallet/store/actions/actionTypes';

export const initialState = [];

/**
 *
 * @param {Object} state
 * @param {Object} action
 */
export const devices = (state = initialState, action) => {
  const { type, devices: newDevices } = action;
  switch (type) {
    case actionTypes.setDevices: {
      return newDevices;
    }
    default:
      return state;
  }
};
