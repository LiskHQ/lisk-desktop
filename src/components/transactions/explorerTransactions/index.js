import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { searchTransactions, searchMoreTransactions, searchAccount, searchMoreVoters } from '../../../actions/search';
import { transactionsRequested, transactionsFilterSet } from '../../../actions/transactions';
import actionTypes from '../../../constants/actions';
import ExplorerTransactions from './explorerTransactions';
import txFilters from './../../../constants/transactionFilters';

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => ({
  delegate: state.search.delegates[state.search.lastSearch],
  transaction: state.transaction,
  transactions: state.transactions[ownProps.address] ?
    [
      ...state.transactions[ownProps.address].pending ?
        state.transactions[ownProps.address].pending : [],
      ...state.transactions[ownProps.address].confirmed ?
        state.transactions[ownProps.address].confirmed : [],
    ] : [],
  votes: state.search.votes[state.search.lastSearch],
  voters: state.search.voters[state.search.lastSearch],
  votersSize: state.search.votersSize &&
    state.search.votersSize[state.search.lastSearch] ?
    state.search.votersSize[state.search.lastSearch] : 0,
  count: state.transactions[ownProps.address] ?
    state.transactions[ownProps.address].count : 0,
  activeFilter: state.filters.wallet || txFilters.all,
  isSearchInStore: state.search.transactions[ownProps.address] !== undefined,
  loading: state.loading,
});

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
