// istanbul ignore file
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { feedbackDialogDisplayed, dialogDisplayed, dialogHidden } from '../../actions/dialog';
import { accountLoggedOut } from '../../actions/account';
import TopBar from './topBar';

const mapStateToProps = state => ({
  account: state.account,
  showDelegate: state.settings.advancedMode,
});

const mapDispatchToProps = {
  feedbackDialogDisplayed,
  setActiveDialog: dialogDisplayed,
  closeDialog: dialogHidden,
  logOut: accountLoggedOut,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(translate()(TopBar)));
