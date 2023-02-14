import { IPC_MESSAGES } from '@libs/hwServer/constants';

const { DEVICE_LIST_CHANGED, DEVICE_UPDATE } = IPC_MESSAGES;

export const initialState = {
  hardwareDevices: [],
  activeHardwareDeviceId: '',
};

/**
 *
 * @param {Object} state
 * @param {type: String, chainId: string} action
 */
export const hardwareWallet = (state = initialState, { type, payload }) => {
  switch (type) {
    case DEVICE_UPDATE: {
      return { ...state, activeHardwareDeviceId: payload };
    }
    case DEVICE_LIST_CHANGED: {
      return { ...state, hardwareDevices: payload };
    }

    default:
      return state;
  }
};
