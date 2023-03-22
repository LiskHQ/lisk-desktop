/* eslint-disable no-use-before-define */
import actionTypes from '@hardwareWallet/store/actions/actionTypes';
import { imDeleteFromArrayById, imPush } from 'src/utils/immutableUtils';

export const initialState = [];

/**
 *
 * @param {Array} state
 * @param {Object} action
 */
export const devices = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionTypes.setHWDevices: {
      return payload;
    }
    case actionTypes.addHWDevice: {
      return imPush(state, payload);
    }
    case actionTypes.removeHWDevice: {
      return imDeleteFromArrayById(state, 'path', payload.path);
    }
    default:
      return state;
  }
};
