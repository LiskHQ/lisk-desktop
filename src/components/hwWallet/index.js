import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { loadingStarted, loadingFinished } from '../../actions/loading';
import { liskAPIClientSet } from '../../actions/peers';
import networks from '../../constants/networks';

import HwWallet from './hwWallet';

const mapStateToProps = state => ({
  network: state.settings.network || networks.mainnet.code,
  peers: state.peers,
  account: state.account,
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
