import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { loadTransactions, transactionsRequested, transactionsFilterSet } from '../../actions/transactions';
import { searchTransactions, searchMoreTransactions } from '../../actions/search';
import actionTypes from '../../constants/actions';
import Transactions from './transactions';

const mapStateToProps = state => ({
  activePeer: state.peers.data,
  transactions: [...state.transactions.pending, ...state.transactions.confirmed],
  count: state.transactions.count,
  confirmedCount: state.transactions.confirmed.length,
  pendingCount: state.transactions.pending.length,
  confirmed: state.transactions.confirmed,
  pending: state.transactions.pending,
  loading: state.loading,
});

const mapDispatchToProps = dispatch => ({
  searchTransactions: data => dispatch(searchTransactions(data)),
  searchMoreTransactions: data => dispatch(searchMoreTransactions(data)),
  searchUpdateLast: data =>
    dispatch({ data, type: actionTypes.searchUpdateLast }),
  loadTransactions: data => dispatch(loadTransactions(data)),
  transactionsRequested: data => dispatch(transactionsRequested(data)),
  transactionsFilterSet: data => dispatch(transactionsFilterSet(data)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(translate()(Transactions)),
);
