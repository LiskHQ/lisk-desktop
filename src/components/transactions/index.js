import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { transactionsRequested, transactionsFilterSet } from '../../actions/transactions';
import Transactions from './transactions';

const mapStateToProps = state => ({
  activePeer: state.peers.data,
  transactions: [...state.transactions.pending, ...state.transactions.confirmed],
  count: state.transactions.count,
  confirmedCount: state.transactions.confirmed.length,
  pendingCount: state.transactions.pending.length,
  confirmed: state.transactions.confirmed,
  pending: state.transactions.pending,
  activeFilter: state.transactions.filter,
  loading: state.loading,
});

const mapDispatchToProps = dispatch => ({
  transactionsRequested: data => dispatch(transactionsRequested(data)),
  transactionsFilterSet: data => dispatch(transactionsFilterSet(data)),
});


export default connect(mapStateToProps, mapDispatchToProps)(translate()(Transactions));
