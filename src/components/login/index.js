import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { setDefaults, translate } from 'react-i18next';
import { dialogDisplayed } from '../../actions/dialog';
import Login from './login';
import { activePeerSet } from '../../actions/peers';
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
});

const mapDispatchToProps = dispatch => ({
  activePeerSet: data => dispatch(activePeerSet(data)),
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  settingsUpdated: data => dispatch(settingsUpdated(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(translate()(Login)));
