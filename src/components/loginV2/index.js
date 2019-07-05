/* istanbul ignore file */
import { connect } from 'react-redux';
import { setDefaults, translate } from 'react-i18next';

import { errorToastDisplayed } from '../../actions/toaster';
import { getActiveTokenAccount } from '../../utils/account';
import { login } from '../../actions/account';
import { settingsUpdated } from '../../actions/settings';
import LoginV2 from './loginV2';

setDefaults({
  wait: true,
  withRef: false,
  bindI18n: 'languageChanged loaded',
  bindStore: 'added removed',
  nsMode: 'default',
  translateFuncName: 't',
});

const mapStateToProps = state => ({
  account: getActiveTokenAccount(state),
  peers: state.peers,
  settings: state.settings,
  liskAPIClient: state.peers && state.peers.liskAPIClient,
});

const mapDispatchToProps = {
  login,
  settingsUpdated,
  errorToastDisplayed,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(LoginV2));
