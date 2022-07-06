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

export const addApplication = (application) => ({
  type: actionTypes.addApplicationByChainId,
  data: application,
});

export const deleteApplication = (chainId) => ({
  type: actionTypes.deleteApplicationByChainId,
  data: chainId,
});
