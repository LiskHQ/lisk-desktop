/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { getTransactions } from '../../../utils/api/transactions';
import { loadLastTransaction } from '../../../actions/transactions';
import {
  searchTransactions, searchMoreTransactions, searchAccount, fetchVotedDelegateInfo,
} from '../../../actions/search';
import ExplorerTransactions from './explorerTransactions';
import actionTypes from '../../../constants/actions';
import txFilters from '../../../constants/transactionFilters';
import withData from '../../../utils/withData';

const mapStateToProps = (state, ownProps) => ({
  delegate: state.search.delegates[state.search.lastSearch],
  transaction: state.transaction,
  transactions: state.search.searchResults,
  votes: state.search.votes[state.search.lastSearch],
  count: state.search.transactions[state.search.lastSearch]
    && (state.search.transactions[state.search.lastSearch].count || 0),
  offset: state.search.searchResults.length,
  activeFilter: state.filters.transactions || txFilters.all,
  isSearchInStore: state.search.transactions[ownProps.address] !== undefined,
  loading: state.loading,
  account: state.account,
  bookmarks: state.bookmarks,
  wallets: state.wallets,
  peers: state.peers,
  detailAccount: state.search.accounts[state.search.lastSearch],
  balance: state.search.accounts[state.search.lastSearch]
    && state.search.accounts[state.search.lastSearch].balance,
  activeToken: state.settings.token ? state.settings.token.active : 'LSK',
});

const mapDispatchToProps = {
  fetchVotedDelegateInfo,
  searchAccount,
  searchTransactions,
  searchMoreTransactions,
  addFilter: data => ({ type: actionTypes.addFilter, data }),
  searchUpdateLast: data => ({ data, type: actionTypes.searchUpdateLast }),
  loadLastTransaction,
};

const apis = {
  transactions: {
    apiUtil: (apiClient, params) => getTransactions(params),
    getApiParams: (state, ownProps) => ({
      token: state.settings.token.active,
      address: ownProps.match.params.address,
      networkConfig: state.network,
    }),
    defaultData: {
      data: [],
      meta: {},
    },
  },
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withData(apis)(translate()(ExplorerTransactions))));
