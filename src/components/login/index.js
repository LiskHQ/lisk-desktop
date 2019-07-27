/* istanbul ignore file */
import { connect } from 'react-redux';
import { setDefaults, translate } from 'react-i18next';

import { getAPIClient } from '../../utils/api/network';
import { errorToastDisplayed } from '../../actions/toaster';
import { getActiveTokenAccount } from '../../utils/account';
import { login } from '../../actions/account';
import { settingsUpdated } from '../../actions/settings';
import Login from './login';

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
  network: state.network,
  settings: state.settings,
  liskAPIClient: getAPIClient(state.settings.token.active, state),
});

const mapDispatchToProps = {
  login,
  settingsUpdated,
  errorToastDisplayed,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(Login));
