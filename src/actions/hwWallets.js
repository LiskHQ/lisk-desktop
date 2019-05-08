import actionTypes from '../constants/actions';

/**
 * An action to dispatch a device list to HwWallets
 *
 */
export const updateDeviceList = data => ({
  data,
  type: actionTypes.deviceListUpdated,
});

export default updateDeviceList;
