import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import {
  searchTransactions, searchMoreTransactions, searchAccount, searchMoreVoters,
} from '../../../actions/search';
import actionTypes from '../../../constants/actions';
import ExplorerTransactions from './explorerTransactions';
import txFilters from '../../../constants/transactionFilters';

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => ({
  delegate: state.search.delegates[state.search.lastSearch],
  transaction: state.transaction,
  transactions: state.search.searchResults,
  votes: state.search.votes[state.search.lastSearch],
  voters: state.search.voters[state.search.lastSearch],
  votersSize: state.search.votersSize
    && state.search.votersSize[state.search.lastSearch]
    ? state.search.votersSize[state.search.lastSearch] : 0,
  count: state.search.transactions[state.search.lastSearch]
    && (state.search.transactions[state.search.lastSearch].count || null),
  offset: state.search.searchResults.length,
  activeFilter: state.filters.transactions || txFilters.all,
  isSearchInStore: state.search.transactions[ownProps.address] !== undefined,
  loading: state.loading,
});

/* istanbul ignore next */
const mapDispatchToProps = {
  searchAccount,
  searchTransactions,
  searchMoreTransactions,
  addFilter: data => ({ type: actionTypes.addFilter, data }),
  searchUpdateLast: data => ({ data, type: actionTypes.searchUpdateLast }),
  searchMoreVoters,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(ExplorerTransactions)));
