import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { searchTransactions, searchMoreTransactions, searchAccount } from '../../../actions/search';
import actionTypes from '../../../constants/actions';
import ExplorerTransactions from './explorerTransactions';
import txFilters from './../../../constants/transactionFilters';

const mapStateToProps = (state, ownProps) => ({
  delegate: state.search.delegates[state.search.lastSearch],
  transaction: state.transaction,
  transactions: state.search.searchResults,
  votes: state.search.votes[state.search.lastSearch],
  voters: state.search.voters[state.search.lastSearch],
  count: state.search.transactions[state.search.lastSearch] &&
    (state.search.transactions[state.search.lastSearch].count || null),
  offset: state.search.searchResults.length,
  activeFilter: state.filters.transactions || txFilters.all,
  isSearchInStore: state.search.transactions[ownProps.address] !== undefined,
  loading: state.loading,
});

const mapDispatchToProps = dispatch => ({
  searchAccount: data => dispatch(searchAccount(data)),
  searchTransactions: data => dispatch(searchTransactions(data)),
  searchMoreTransactions: data => dispatch(searchMoreTransactions(data)),
  addFilter: data => dispatch({ type: actionTypes.addFilter, data }),
  searchUpdateLast: data =>
    dispatch({ data, type: actionTypes.searchUpdateLast }),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(ExplorerTransactions)));
