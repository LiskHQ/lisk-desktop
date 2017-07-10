import actionTypes from '../constants/actions';

/**
 *
 *
 */
export const activePeerSet = data => ({
  data,
  type: actionTypes.activePeerSet,
});

/**
 *
 *
 */
export const activePeerReset = () => ({
  type: actionTypes.activePeerReset,
});
