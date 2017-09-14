import actionTypes from '../constants/actions';
import Alert from '../components/dialog/alert';

/**
 * An action to dispatch to display a dialog
 *
 */
export const dialogDisplayed = data => ({
  data,
  type: actionTypes.dialogDisplayed,
});

/**
 * An action to dispatch to display an alert dialog
 *
 */
export const alertDialogDisplayed = data => dialogDisplayed({
  title: data.title,
  type: data.type,
  childComponent: Alert,
  childComponentProps: {
    text: data.text,
  },
});

/**
 * An action to dispatch to display a success alert dialog
 *
 */
export const successAlertDialogDisplayed = data => alertDialogDisplayed({
  title: 'Success',
  text: data.text,
  type: 'success',
});

/**
 * An action to dispatch to display a error alert dialog
 *
 */
export const errorAlertDialogDisplayed = data => alertDialogDisplayed({
  title: 'Error',
  text: data.text,
  type: 'error',
});

/**
 * An action to dispatch to hide a dialog
 *
 */
export const dialogHidden = () => ({
  type: actionTypes.dialogHidden,
});
