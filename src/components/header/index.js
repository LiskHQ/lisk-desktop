import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { dialogDisplayed } from '../../actions/dialog';
import { accountLoggedOut, removePassphrase, accountUpdated } from '../../actions/account';
import { removeSavedAccountPassphrase } from '../../actions/savedAccounts';
import accountConfig from '../../constants/account';
import Header from './header';

const { lockDuration } = accountConfig;

const mapStateToProps = state => ({
  account: state.account,
  autoLog: state.settings.autoLog,
  isAuthenticated: !!state.account.publicKey,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  setActiveDialog: data => dispatch(dialogDisplayed(data)),
  logOut: () => dispatch(accountLoggedOut()),
  removePassphrase: data => dispatch(removePassphrase(data)),
  removeSavedAccountPassphrase: () => dispatch(removeSavedAccountPassphrase()),
  resetTimer: () => dispatch(accountUpdated({ expireTime: Date.now() + lockDuration })),
});
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Header)));
