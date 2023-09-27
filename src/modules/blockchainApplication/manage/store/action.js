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
export const addApplication = (app, network) => ({
  type: actionTypes.addApplicationByChainId,
  app,
  network,
});

/**
 * Trigger this action to add blockchain application
 *
 * @returns {Object} - Action object
 */
export const setApplications = (apps, network) => ({
  type: actionTypes.setApplications,
  apps,
  network,
});

/**
 * Trigger this action to delete blockchain application
 *
 * @returns {Object} - Action object
 */
export const deleteApplication = (chainId, network) => ({
  type: actionTypes.deleteApplicationByChainId,
  chainId,
  network,
});

export const deleteNetworkInApplications = (network) => ({
  type: actionTypes.deleteNetworkInApplications,
  network,
});

export const updateNetworkNameInApplications = (currentName, newName) => ({
  type: actionTypes.updateNetworkNameInApplications,
  currentName,
  newName
});

/**
 * Trigger this action to set current blockchain application
 *
 * @returns {Object} - Action object
 */
export const setCurrentApplication = (app) => ({
  type: actionTypes.setCurrentApplication,
  app,
});
