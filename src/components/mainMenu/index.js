import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { feedbackDialogDisplayed } from '../../actions/dialog';
import MainMenu from './mainMenu';

const mapStateToProps = state => ({
  account: state.account,
  showDelegate: state.settings.advancedMode,
});

const mapDispatchToProps = () => ({
  feedbackDialogDisplayed,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(translate()(MainMenu)));

