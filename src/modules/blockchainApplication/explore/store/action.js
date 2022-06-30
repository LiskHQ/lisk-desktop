import actionTypes from './actionTypes';

/**
 * Trigger this action to set blockchain application pin
 *
 * @returns {Object} - Action object
 */
export const pinApplication = (chainId) => ({
  type: actionTypes.setApplicationPin,
  chainId,
});

export const removePinnedApplication = (chainId) => ({
  type: actionTypes.removeApplicationPin,
  chainId,
});
