import actionTypes from '@hardwareWallet/store/actions/actionTypes';

export const initialState = {
  manufacturer: '',
  path: '',
  product: '',
  status: 'standby',
};

/**
 *
 * @param {Object} state
 * @param {Object} action
 */
/* istanbul ignore next */
export const currentDevice = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionTypes.setCurrentHWDevice: {
      return payload;
    }
    case actionTypes.addHWDevice: {
      return payload;
    }
    case actionTypes.removeHWDevice: {
      const isCurrentAccount = payload.path === state.path;
      return isCurrentAccount ? initialState : state;
    }
    default:
      return state;
  }
};
