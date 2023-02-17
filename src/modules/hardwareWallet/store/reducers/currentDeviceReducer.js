import actionTypes from '@hardwareWallet/store/actions/actionTypes';

export const initialState = {
  deviceId: '',
  model: '',
  brand: '',
  status: 'disconnected',
};

/**
 *
 * @param {Object} state
 * @param {Object} action
 */
/* istanbul ignore next */
export const currentDevice = (state = initialState, action) => {
  const { type, device } = action;
  switch (type) {
    case actionTypes.setCurrentDevice: {
      return device;
    }
    default:
      return state;
  }
};
