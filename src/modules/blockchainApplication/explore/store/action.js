import actionTypes from './actionTypes';

/**
 * Trigger this action to set blockchain application pin
 *
 * @returns {Object} - Action object
 */
export const pinApplication = (data) => ({
  type: actionTypes.setApplicationPin,
  data,
});

export const removePinnedApplication = (data) => ({
  type: actionTypes.removeApplicationPin,
  data,
});
