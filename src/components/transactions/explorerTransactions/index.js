import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { searchTransactions, searchMoreTransactions, searchAccount, searchMoreVoters } from '../../../actions/search';
import { transactionsRequested, transactionsFilterSet } from '../../../actions/transactions';
import actionTypes from '../../../constants/actions';
import ExplorerTransactions from './explorerTransactions';
import txFilters from './../../../constants/transactionFilters';

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => {
  console.log('ExplorerTransactionsA', state.search.searchResults);
  console.log('ExplorerTransactionsB', state.search.transactions);
  console.log('ExplorerTransactionsC', state.search.transactions[ownProps.address]);
  console.log('ExplorerTransactionsD', state.transactions[ownProps.address]);
  return {
    delegate: state.search.delegates[state.search.lastSearch],
    transaction: state.transaction,
    // transactions: [...state.transactions.pending, ...state.transactions.confirmed],
    transactions: [],
    // transactions: state.search.searchResults,
    votes: state.search.votes[state.search.lastSearch],
    voters: state.search.voters[state.search.lastSearch],
    votersSize: state.search.votersSize &&
      state.search.votersSize[state.search.lastSearch] ?
      state.search.votersSize[state.search.lastSearch] : 0,
    count: state.search.transactions[state.search.lastSearch] &&
      (state.search.transactions[state.search.lastSearch].count || null),
    offset: state.search.searchResults.length,
    activeFilter: state.filters.transactions || txFilters.all,
    isSearchInStore: state.search.transactions[ownProps.address] !== undefined,
    loading: state.loading,
  };
};

/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  transactionsRequested: data => dispatch(transactionsRequested(data)),
  transactionsFilterSet: data => dispatch(transactionsFilterSet(data)),
  searchAccount: data => dispatch(searchAccount(data)),
  searchTransactions: data => dispatch(searchTransactions(data)),
  searchMoreTransactions: data => dispatch(searchMoreTransactions(data)),
  addFilter: data => dispatch({ type: actionTypes.addFilter, data }),
  searchUpdateLast: data =>
    dispatch({ data, type: actionTypes.searchUpdateLast }),
  searchMoreVoters: data => dispatch(searchMoreVoters(data)),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(ExplorerTransactions)));
