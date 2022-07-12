import actionTypes from './actionTypes';

/**
 * Trigger this action to toggle blockchain application pin
 *
 * @returns {Object} - Action object
 */
export const toggleApplicationPin = (chainId) => ({
  type: actionTypes.toggleApplicationPin,
  chainId,
});

/**
 * Trigger this action to add blockchain application
 *
 * @returns {Object} - Action object
 */
export const addApplication = (application) => ({
  type: actionTypes.addApplicationByChainId,
  application,
});

/**
 * Trigger this action to delete blockchain application
 *
 * @returns {Object} - Action object
 */
export const deleteApplication = (chainId) => ({
  type: actionTypes.deleteApplicationByChainId,
  chainId,
});

/**
 * Trigger this action to set current blockchain application
 *
 * @returns {Object} - Action object
 */
export const setCurrentApplication = (application) => ({
  type: actionTypes.setCurrentApplication,
  application,
});
