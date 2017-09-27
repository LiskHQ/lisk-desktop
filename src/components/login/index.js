import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { dialogDisplayed } from '../../actions/dialog';
import Login from './login';
import { activePeerSet } from '../../actions/peers';
import { accountsRetrieved } from '../../actions/savedAccounts';

translate.setDefaults({
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
});

const mapDispatchToProps = dispatch => ({
  activePeerSet: data => dispatch(activePeerSet(data)),
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  accountsRetrieved: data => dispatch(accountsRetrieved(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(translate()(Login)));
