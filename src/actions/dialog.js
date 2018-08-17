import i18next from 'i18next';
import FeedbackForm from '../components/feedbackForm';
import Alert from '../components/dialog/alert';
import actionTypes from '../constants/actions';

/**
 * An action to dispatch to display a dialog
 *
 */
export const dialogDisplayed = data => ({
  data,
  type: actionTypes.dialogDisplayed,
});

export const feedbackDialogDisplayed = data => dialogDisplayed({
  title: data.title,
  type: data.type,
  childComponent: FeedbackForm,
  ...data,
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
  title: i18next.t('Success'),
  text: data.text,
  type: 'success',
});

/**
 * An action to dispatch to display a error alert dialog
 *
 */
export const errorAlertDialogDisplayed = data => alertDialogDisplayed({
  title: i18next.t('Error'),
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
