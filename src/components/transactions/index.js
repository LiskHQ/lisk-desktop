import { connect } from 'react-redux';
import Transactions from './transactions';
import { transactionsRequested } from '../../actions/transactions';

const mapStateToProps = state => ({
  address: state.account.address,
  activePeer: state.peers.data,
  transactions: [...state.transactions.pending, ...state.transactions.confirmed],
  count: state.transactions.count,
  confirmedCount: state.transactions.confirmed.length,
  pendingCount: state.transactions.pending.length,
});

const mapDispatchToProps = dispatch => ({
  transactionsRequested: data => dispatch(transactionsRequested(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);

