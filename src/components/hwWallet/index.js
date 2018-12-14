import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { loadingStarted, loadingFinished } from '../../actions/loading';
import { liskAPIClientSet } from '../../actions/peers';
import HwWallet from './hwWallet';

const mapStateToProps = state => ({
  network: state.settings.network,
  liskAPIClient: state.peers && state.peers.liskAPIClient,
});

const mapDispatchToProps = {
  liskAPIClientSet,
  loadingFinished,
  loadingStarted,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(HwWallet));
