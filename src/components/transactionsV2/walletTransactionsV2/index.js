/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { loadLastTransaction, transactionsRequested, transactionsFilterSet } from '../../../actions/transactions';
import { searchAccount, fetchVotedDelegateInfo } from '../../../actions/search';
import { updateAccountDelegateStats } from '../../../actions/account';
import WalletTransactionsV2 from './walletTransactionsV2';
import actionTypes from '../../../constants/actions';
import txFilters from './../../../constants/transactionFilters';
import removeDuplicateTransactions from '../../../utils/transactions';
import { getActiveTokenAccount } from '../../../utils/account';

const mapStateToProps = (state, ownProps) => ({
  account: getActiveTokenAccount(state),
  transaction: state.transaction,
  transactions:
    removeDuplicateTransactions(
      state.transactions.pending,
      state.transactions.confirmed,
    ).filter(tx => !state.settings.token ||
      state.settings.token.active === tx.token),
  count: state.transactions.count,
  activeFilter: state.filters.wallet || txFilters.all,
  loading: state.loading,
  followedAccounts: state.followedAccounts,
  wallets: state.wallets,
  peers: state.peers,
  balance: getActiveTokenAccount(state).balance,
  votes: state.search.votes[ownProps.account.info.LSK.address],
});

const mapDispatchToProps = {
  transactionsRequested,
  transactionsFilterSet,
  loadLastTransaction,
  updateAccountDelegateStats,
  searchAccount,
  fetchVotedDelegateInfo,
  addFilter: data => ({ type: actionTypes.addFilter, data }),
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(WalletTransactionsV2)));
