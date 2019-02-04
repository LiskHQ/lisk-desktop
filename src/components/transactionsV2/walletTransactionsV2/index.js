/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { transactionsRequested, transactionsFilterSet } from '../../../actions/transactions';
import { accountVotersFetched, accountVotesFetched } from '../../../actions/account';
import { searchAccount } from '../../../actions/search';
import WalletTransactionsV2 from './walletTransactionsV2';
import actionTypes from '../../../constants/actions';
import txFilters from './../../../constants/transactionFilters';
import removeDuplicateTransactions from '../../../utils/transactions';

const mapStateToProps = state => ({
  account: state.account,
  transaction: state.transaction,
  transactions:
    removeDuplicateTransactions(
      state.transactions.pending,
      state.transactions.confirmed,
    ),
  votes: state.account.votes ?
    state.account.votes :
    state.search.votes[state.account.addres],
  voters: state.account.voters ?
    state.account.voters :
    state.search.voters[state.account.address],
  count: state.transactions.count,
  // Pick delegate from source
  delegate: (state.account && state.account.delegate) ?
    state.account && (state.account.delegate || null) :
    state.search.delegates[state.account.address],
  activeFilter: state.filters.wallet || txFilters.all,
  loading: state.loading,
  followedAccounts: state.followedAccounts.accounts,
});

const mapDispatchToProps = {
  searchAccount,
  transactionsRequested,
  transactionsFilterSet,
  accountVotersFetched,
  accountVotesFetched,
  addFilter: data => ({ type: actionTypes.addFilter, data }),
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(WalletTransactionsV2)));
