import actionTypes from '../constants/actions';

/**
 * An action to dispatch a device list to HwWallets
 *
 */
export const devicesListUpdated = data => ({
  data,
  type: actionTypes.devicesListUpdate,
});

export default devicesListUpdated;
