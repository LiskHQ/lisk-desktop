import { connect } from 'react-redux';
import Transactions from './transactionsComponent';
import { transactionsLoaded } from '../../actions/transactions';

const mapStateToProps = state => ({
  address: state.account.address,
  activePeer: state.peers.data,
  transactions: [...state.transactions.pending, ...state.transactions.confirmed],
});

const mapDispatchToProps = dispatch => ({
  transactionsLoaded: data => dispatch(transactionsLoaded(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);

