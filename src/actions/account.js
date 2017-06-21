import actionTypes from '../constants/actions';

/**
 *
 *
 */
export const setAccount = data => ({
  data,
  type: actionTypes.setAccount,
});

/**
 *
 *
 */
export const resetAccount = () => ({
  type: actionTypes.resetAccount,
});
