import actionTypes from '../constants/actions';

/**
 *
 *
 */
export const accountUpdated = data => ({
  data,
  type: actionTypes.accountUpdated,
});

/**
 *
 *
 */
export const accountLoggedOut = () => ({
  type: actionTypes.accountLoggedOut,
});
