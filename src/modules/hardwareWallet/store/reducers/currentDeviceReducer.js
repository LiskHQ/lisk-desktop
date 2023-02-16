import actionTypes from '@hardwareWallet/store/actions/actionTypes';

export const initialState = {
  status: 'disconnected',
};

/**
 *
 * @param {Object} state
 * @param {Object} action
 */
export const currentDevice = (state = initialState, action) => {
  const { type, device } = action;
  switch (type) {
    case actionTypes.deviceUpdate: {
      return device;
    }
    default:
      return state;
  }
};
