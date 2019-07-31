/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { getTransactions } from '../../../utils/api/transactions';
import { loadLastTransaction } from '../../../actions/transactions';
import {
  searchAccount, fetchVotedDelegateInfo,
} from '../../../actions/search';
import ExplorerTransactions from './explorerTransactions';
import actionTypes from '../../../constants/actions';
import txFilters from '../../../constants/transactionFilters';
import withData from '../../../utils/withData';

const mapStateToProps = (state, ownProps) => ({
  delegate: state.search.delegates[ownProps.address],
  transaction: state.transaction,
  // transactions: state.search.searchResults,
  votes: state.search.votes[ownProps.address],
  count: state.search.transactions[ownProps.address]
    && (state.search.transactions[ownProps.address].count || 0),
  offset: state.search.searchResults.length,
  isSearchInStore: state.search.transactions[ownProps.address] !== undefined,
  loading: state.loading,
  account: state.account,
  bookmarks: state.bookmarks,
  wallets: state.wallets,
  detailAccount: state.search.accounts[ownProps.address],
  balance: state.search.accounts[ownProps.address]
    && state.search.accounts[ownProps.address].balance,
  activeToken: state.settings.token ? state.settings.token.active : 'LSK',
});

const mapDispatchToProps = {
  fetchVotedDelegateInfo,
  searchAccount,
  searchUpdateLast: data => ({ data, type: actionTypes.searchUpdateLast }),
  loadLastTransaction,
};

// TODO the sort should be removed when BTC api returns transactions sorted by timestamp
const sortByTimestamp = (a, b) => (
  ((!a.timestamp && a.timestamp !== 0) || a.timestamp > b.timestamp) && b.timestamp ? -1 : 1
);

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
    defaultUrlSearchParams: {
      filters: {
        direction: txFilters.all,
      },
    },
    transformResponse: (response, oldData) => (
      response.meta.offset > 0 ? {
        ...oldData,
        data: [
          ...oldData.data, ...response.data,
        ].sort(sortByTimestamp),
      } : {
        ...response,
        data: response.data.sort(sortByTimestamp),
      }
    ),
  },
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(withData(apis)(translate()(ExplorerTransactions))));
