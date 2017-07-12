import actionTypes from '../constants/actions';

/**
 *
 *
 */
export const dialogDisplayed = data => ({
  data,
  type: actionTypes.dialogDisplayed,
});

/**
 *
 *
 */
export const dialogHidden = () => ({
  type: actionTypes.dialogHidden,
});
