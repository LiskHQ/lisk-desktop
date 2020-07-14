// istanbul ignore file
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withTranslation } from 'react-i18next';
import { accountLoggedOut, accountUpdated } from '../../../../actions/account';
import { networkSet } from '../../../../actions/network';
import accountConfig from '../../../../constants/account';
import TopBar from './topBar';

const mapStateToProps = state => ({
  account: state.account,
  network: state.network,
  token: state.settings.token,
  settings: state.settings,
});

const mapDispatchToProps = {
  logOut: accountLoggedOut,
  networkSet,
  resetTimer: () => accountUpdated({ expireTime: Date.now() + accountConfig.lockDuration }),
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(
    withTranslation()(TopBar),
  ),
);
