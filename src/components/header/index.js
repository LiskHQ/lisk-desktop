/* istanbul ignore file */
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

const mapDispatchToProps = {
  setActiveDialog: dialogDisplayed,
  closeDialog: dialogHidden,
  logOut: accountLoggedOut,
  removePassphrase,
  resetTimer: accountUpdated({ expireTime: Date.now() + lockDuration }),
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Header)));
