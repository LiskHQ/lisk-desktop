import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { accountUpdated } from '../../actions/account';
import { activePeerSet } from '../../actions/peers';
import Passphrase from './passphrase';

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
)(translate()(Passphrase));

export default PassphraseConnected;
