/* istanbul ignore file */
import { connect } from 'react-redux';
import { setDefaults, translate } from 'react-i18next';
import LoginV2 from './loginV2';
import { liskAPIClientSet } from '../../actions/peers';
import { errorToastDisplayed } from '../../actions/toaster';
import { settingsUpdated } from '../../actions/settings';

setDefaults({
  wait: true,
  withRef: false,
  bindI18n: 'languageChanged loaded',
  bindStore: 'added removed',
  nsMode: 'default',
  translateFuncName: 't',
});

const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
  settings: state.settings,
  liskAPIClient: state.peers && state.peers.liskAPIClient,
});

const mapDispatchToProps = {
  liskAPIClientSet,
  settingsUpdated,
  errorToastDisplayed,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(LoginV2));
