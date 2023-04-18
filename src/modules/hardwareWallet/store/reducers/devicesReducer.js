/* eslint-disable no-use-before-define */
import actionTypes from '@hardwareWallet/store/actions/actionTypes';
import { immutableDeleteFromArrayById, immutablePush } from 'src/utils/immutableUtils';

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
      return immutablePush(state, payload);
    }
    case actionTypes.removeHWDevice: {
      return immutableDeleteFromArrayById(state, 'path', payload.path);
    }
    default:
      return state;
  }
};
