import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { getActiveTokenAccount } from '../../utils/account';
import { liskAPIClientSet } from '../../actions/peers';
import { settingsUpdated } from '../../actions/settings';
import { getAPIClient } from '../../utils/api/network';
import Splashscreen from './splashscreen';

const mapStateToProps = state => ({
  network: state.network,
  account: getActiveTokenAccount(state),
  settings: state.settings,
  liskAPIClient: getAPIClient(state.settings.token ? state.settings.token.active : 'LSK', state),
});

const mapDispatchToProps = {
  liskAPIClientSet,
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Splashscreen));
