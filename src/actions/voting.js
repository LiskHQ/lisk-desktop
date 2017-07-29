import actionTypes from '../constants/actions';

/**
 * Add data to the list of voted delegates
 *
 */
export const addToVotedList = data => ({
  type: actionTypes.addToVotedList,
  data,
});

/**
 * Remove data from the list of voted delegates
 *
 */
export const removeFromVotedList = data => ({
  type: actionTypes.removeFromVotedList,
  data,
});
/**
 * Add data to the list of voted delegates
 *
 */
export const addToUnvotedList = data => ({
  type: actionTypes.addToUnvotedList,
  data,
});

/**
 * Remove data from the list of voted delegates
 *
 */
export const removeFromUnvotedList = data => ({
  type: actionTypes.removeFromUnvotedList,
  data,
});
