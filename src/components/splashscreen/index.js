import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { getActiveTokenAccount } from '../../utils/account';
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
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Splashscreen));
