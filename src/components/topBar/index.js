// istanbul ignore file
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { accountLoggedOut, accountUpdated } from '../../actions/account';
import { settingsUpdated } from '../../actions/settings';
import accountConfig from '../../constants/account';
import TopBar from './topBar';

const mapStateToProps = state => ({
  account: state.account,
  network: state.network,
  token: state.settings.token,
  autoLogout: state.settings.autoLog,
});

const mapDispatchToProps = {
  settingsUpdated,
  logOut: accountLoggedOut,
  resetTimer: () => accountUpdated({ expireTime: Date.now() + accountConfig.lockDuration }),
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(translate()(TopBar)));
