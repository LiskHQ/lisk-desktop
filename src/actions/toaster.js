import actionTypes from '../constants/actions';

/**
 * An action to dispatch to display a toast
 *
 */
export const toastDisplayed = data => ({
  data,
  type: actionTypes.toastDisplayed,
});

/**
 * An action to dispatch to display a success toast
 *
 */
export const successToastDisplayed = ({ type = 'success', ...rest }) =>
  toastDisplayed({ type, ...rest });


/**
 * An action to dispatch to display an error toast
 *
 */
export const errorToastDisplayed = ({ type = 'error', ...rest }) =>
  toastDisplayed({ type, ...rest });

/**
 * An action to dispatch to hide a toast
 *
 */
export const toastHidden = data => ({
  data,
  type: actionTypes.toastHidden,
});
