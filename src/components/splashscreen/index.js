import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { liskAPIClientSet } from '../../actions/peers';
import { settingsUpdated } from '../../actions/settings';
import Splashscreen from './splashscreen';

const mapStateToProps = state => ({
  settings: state.settings,
  liskAPIClient: state.peers && state.peers.liskAPIClient,
});

const mapDispatchToProps = {
  liskAPIClientSet,
  settingsUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Splashscreen));
