// istanbul ignore file
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import accountConfig from '../../constants/account';
import { dialogDisplayed, dialogHidden } from '../../actions/dialog';
import { accountLoggedOut, removePassphrase, accountUpdated } from '../../actions/account';
import StatusBar from './statusBar';

const { lockDuration } = accountConfig;

const mapStateToProps = state => ({
  account: state.account,
  autoLogout: state.settings.autoLog,
  isAuthenticated: !!state.account.publicKey,
  peers: state.peers,
  showNetworkIndicator: state.settings.showNetwork,
});

const mapDispatchToProps = {
  setActiveDialog: dialogDisplayed,
  closeDialog: dialogHidden,
  logOut: accountLoggedOut,
  removePassphrase,
  resetTimer: () => accountUpdated({ expireTime: Date.now() + lockDuration }),
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(translate()(StatusBar)));
