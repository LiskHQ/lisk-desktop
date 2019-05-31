/* istanbul ignore file */
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { loadLastTransaction, loadTransactions } from '../../../actions/transactions';
import { searchAccount, fetchVotedDelegateInfo } from '../../../actions/search';
import { updateAccountDelegateStats } from '../../../actions/account';
import WalletTransactionsV2 from './walletTransactionsV2';
import actionTypes from '../../../constants/actions';
import txFilters from './../../../constants/transactionFilters';
import removeDuplicateTransactions from '../../../utils/transactions';
import { tokenMap } from '../../../constants/tokens';

const mapStateToProps = (state, ownProps) => ({
  account: state.account,
  transaction: state.transaction,
  transactions:
    removeDuplicateTransactions(
      state.transactions.pending,
      state.transactions.confirmed,
    ),
  count: state.transactions.count,
  activeFilter: state.filters.wallet || txFilters.all,
  loading: state.loading,
  bookmarks: state.bookmarks,
  wallets: state.wallets,
  peers: state.peers,
  balance: state.account.info && state.account.info[
    state.settings.token && state.settings.token.active ?
      state.settings.token.active :
      tokenMap.LSK.key
  ].balance,
  votes: state.search.votes[ownProps.account.info.LSK.address],
});

const mapDispatchToProps = {
  loadTransactions,
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
