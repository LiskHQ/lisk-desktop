import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { dialogDisplayed, dialogHidden } from '../../actions/dialog';
import { accountLoggedOut, removePassphrase, accountUpdated, accountLoggedIn } from '../../actions/account';
import { removeSavedAccountPassphrase } from '../../actions/savedAccounts';
import accountConfig from '../../constants/account';
import Header from './header';

const { lockDuration } = accountConfig;

const mapStateToProps = state => ({
  account: state.account,
  autoLog: state.settings.autoLog,
  isAuthenticated: !!state.account.publicKey,
  peers: state.peers,
  showNetworkIndicator: state.settings.showNetwork,
});

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  closeDialog: () => dispatch(dialogHidden()),
  logOut: () => dispatch(accountLoggedOut()),
  removePassphrase: data => dispatch(removePassphrase(data)),
  removeSavedAccountPassphrase: data => dispatch(removeSavedAccountPassphrase(data)),
  resetTimer: () => dispatch(accountUpdated({ expireTime: Date.now() + lockDuration })),
  accountLoggedIn: data => dispatch(accountLoggedIn(data)),
});
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Header)));
