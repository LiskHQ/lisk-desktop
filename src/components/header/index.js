import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { dialogDisplayed, dialogHidden } from '../../actions/dialog';
import { accountLoggedOut, removePassphrase, accountUpdated } from '../../actions/account';
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
  resetTimer: () => dispatch(accountUpdated({ expireTime: Date.now() + lockDuration })),
});
export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Header)));
