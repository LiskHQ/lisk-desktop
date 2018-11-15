import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { setDefaults, translate } from 'react-i18next';
import { dialogDisplayed } from '../../actions/dialog';
import Login from './login';
import { liskAPIClientSet } from '../../actions/peers';
import { settingsUpdated } from '../../actions/settings';
import { errorToastDisplayed } from '../../actions/toaster';
import { loadingStarted, loadingFinished } from '../../actions/loading';

setDefaults({
  wait: true,
  withRef: false,
  bindI18n: 'languageChanged loaded',
  bindStore: 'added removed',
  nsMode: 'default',
  translateFuncName: 't',
});

/**
 * Using react-redux connect to pass state and dispatch to Login
 */
const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
  settings: state.settings,
  liskAPIClient: state.peers && state.peers.liskAPIClient,
});

const mapDispatchToProps = dispatch => ({
  liskAPIClientSet: data => dispatch(liskAPIClientSet(data)),
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  settingsUpdated: data => dispatch(settingsUpdated(data)),
  errorToastDisplayed: data => dispatch(errorToastDisplayed(data)),
  loadingFinished: data => dispatch(loadingFinished(data)),
  loadingStarted: data => dispatch(loadingStarted(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(translate()(Login)));
