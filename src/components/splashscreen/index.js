import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Splashscreen from './splashscreen';

const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
  settings: state.settings,
});

export default connect(mapStateToProps)(translate()(Splashscreen));
