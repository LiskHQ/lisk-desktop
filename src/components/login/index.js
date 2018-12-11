import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { setDefaults, translate } from 'react-i18next';
import Login from './login';
import { liskAPIClientSet } from '../../actions/peers';
import { errorToastDisplayed } from '../../actions/toaster';
import { settingsUpdated } from '../../actions/settings';

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
  settingsUpdated: data => dispatch(settingsUpdated(data)),
  errorToastDisplayed: data => dispatch(errorToastDisplayed(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(translate()(Login)));
