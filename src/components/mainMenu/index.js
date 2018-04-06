import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import MainMenu from './mainMenu';

const mapStateToProps = state => ({
  account: state.account,
  showDelegate: state.settings.advancedMode,
});

export default withRouter(connect(mapStateToProps)(translate()(MainMenu)));

