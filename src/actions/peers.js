import actionTypes from '../constants/actions';

/**
 * Returns required action object to set
 * the given peer data as active peer
 *
 * @param {Object} data - Active peer data
 * @returns {Object} Action object
 */
export const activePeerSet = data => ({
  data,
  type: actionTypes.activePeerSet,
});

/**
 * Returns required action object to partially
 * update the active peer
 *
 * @param {Object} data - Active peer data
 * @returns {Object} Action object
 */
export const activePeerUpdate = data => ({
  data,
  type: actionTypes.activePeerUpdate,
});

/**
 * Returns required action object to set
 * the given peers data as active peer
 *
 * @param {Object} data - Active peer data
 * @returns {Object} Action object
 */
export const activePeerReset = () => ({
  type: actionTypes.activePeerReset,
});
