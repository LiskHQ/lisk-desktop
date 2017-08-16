import { connect } from 'react-redux';
import Account from './account';
import { activePeerUpdate } from '../../actions/peers';
import { accountUpdated } from '../../actions/account';
import { transactionsUpdated } from '../../actions/transactions';

/**
 * Passing state
 */
const mapStateToProps = state => ({
  peers: state.peers,
  account: state.account,
});

const mapDispatchToProps = dispatch => ({
  onActivePeerUpdated: data => dispatch(activePeerUpdate(data)),
  onAccountUpdated: data => dispatch(accountUpdated(data)),
  onTransactionsUpdated: data => dispatch(transactionsUpdated(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Account);
