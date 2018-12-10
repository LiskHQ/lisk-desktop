import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import actionTypes from '../../constants/actions';
import { feedbackDialogDisplayed, dialogHidden } from '../../actions/dialog';
import FeedbackFrom from './feedbackForm';

export const mapDispatchToProps = {
  hideDialog: dialogHidden,
  showDialog: feedbackDialogDisplayed,
  sendFeedback: data => ({ data, type: actionTypes.sendFeedback }),
};

export default connect(null, mapDispatchToProps)(translate()(FeedbackFrom));
