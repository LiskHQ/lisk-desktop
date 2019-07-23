/* istanbul ignore file */
import { connect } from 'react-redux';
import Header from './header';
import { liskAPIClientSet } from '../../actions/peers';
import { errorToastDisplayed } from '../../actions/toaster';
import { settingsUpdated } from '../../actions/settings';

const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
  settings: state.settings,
  selectedNetwork: (state.peers && state.peers.options.code) || 0,
  address: state.peers && state.peers.options.address,
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
)(Header);
