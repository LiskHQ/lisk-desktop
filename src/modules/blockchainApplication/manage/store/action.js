import actionTypes from './actionTypes';

/**
 * Trigger this action to toggle blockchain application pin
 *
 * @returns {Object} - Action object
 */
//
// eslint-disable-next-line import/prefer-default-export
export const toggleApplicationPin = (chainId) => ({
  type: actionTypes.toggleApplicationPin,
  chainId,
});

export const setCurrentApplication = (application) => ({
  type: actionTypes.setCurrentApplication,
  application,
});
