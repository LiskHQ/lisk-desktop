import { connect } from 'react-redux';
import Passphrase from './passphrase';
import { accountUpdated } from '../../actions/account';
import { activePeerSet } from '../../actions/peers';

/**
 * Using react-redux connect to pass state and dispatch to LoginForm
 */
const mapStateToProps = state => ({
  account: state.account,
  peers: state.peers,
});

const mapDispatchToProps = dispatch => ({
  onAccountUpdated: data => dispatch(accountUpdated(data)),
  activePeerSet: network => dispatch(activePeerSet(network)),
});

const PassphraseConnected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Passphrase);

export default PassphraseConnected;
