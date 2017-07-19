import actionTypes from '../constants/actions';

/**
 * An action to dispatch to display a dialog
 *
 */
export const dialogDisplayed = data => ({
  data,
  type: actionTypes.dialogDisplayed,
});

/**
 * An action to dispatch to hide a dialog
 *
 */
export const dialogHidden = () => ({
  type: actionTypes.dialogHidden,
});
