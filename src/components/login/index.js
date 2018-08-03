import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { setDefaults, translate } from 'react-i18next';
import { dialogDisplayed } from '../../actions/dialog';
import Login from './login';
import { activePeerSet } from '../../actions/peers';
import { activeAccountSaved } from '../../actions/savedAccounts';
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
  savedAccounts: state.savedAccounts,
  settings: state.settings,
});

const mapDispatchToProps = dispatch => ({
  activePeerSet: data => dispatch(activePeerSet(data)),
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  activeAccountSaved: () => dispatch(activeAccountSaved()),
  settingsUpdated: data => dispatch(settingsUpdated(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(translate()(Login)));
